require('dotenv').config();
const express        = require('express');
const http           = require('http');
const { Server }     = require('socket.io');
const mongoose       = require('mongoose');
const cors           = require('cors');
const { v4: uuidv4 } = require('uuid');

const { Conversation } = require('./models');
const { findMatch, isFollowup } = require('./knowledgeBase');

// ── Free AI SDK setup (auto-detects which key you have) ───────────────────
let geminiClient = null;
let groqClient   = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ Google Gemini API ready (free tier)');
}

if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
  const Groq = require('groq-sdk');
  groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log('✅ Groq API ready (free tier)');
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

if (!geminiClient && !groqClient) {
  console.log('⚠️  No AI API key found — Tier 2 will use built-in responses.');
  console.log('   Get a FREE Gemini key at: https://aistudio.google.com/app/apikey');
}

// ── App setup ─────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.NODE_ENV === 'production' ? false : '*', methods: ['GET','POST'] }
});

app.use(cors());
app.use(express.json());

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
}

// ── MongoDB ───────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.warn('⚠️  MongoDB not connected:', err.message);
    console.warn('   Conversations will not be saved. Start MongoDB to enable persistence.');
  });

// ── REST API ──────────────────────────────────────────────────────────────
app.get('/api/session/:sessionId', async (req, res) => {
  try {
    let conv = await Conversation.findOne({ sessionId: req.params.sessionId });
    if (!conv) conv = await Conversation.create({ sessionId: req.params.sessionId });
    res.json({ session: conv });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/history/:sessionId', async (req, res) => {
  try {
    const conv = await Conversation.findOne({ sessionId: req.params.sessionId });
    res.json({ messages: conv ? conv.messages : [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const total     = await Conversation.countDocuments();
    const resolved  = await Conversation.countDocuments({ status: 'resolved' });
    const escalated = await Conversation.countDocuments({ status: 'escalated' });
    const recent    = await Conversation.find().sort({ createdAt: -1 }).limit(10)
                        .select('sessionId status stage createdAt');
    res.json({ total, resolved, escalated, active: total - resolved - escalated, recent });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'] || req.query.adminPassword || (req.body && req.body.adminPassword);
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Health check — shows which AI provider is active
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    aiProvider: geminiClient ? 'Google Gemini (free)' : groqClient ? 'Groq (free)' : 'built-in fallback',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/admin/escalations', requireAdmin, async (req, res) => {
  try {
    const escalations = await Conversation.find({ status: 'escalated' }).sort({ escalatedAt: -1 }).limit(200);
    res.json({ escalations: escalations.map(conv => ({
      sessionId: conv.sessionId,
      status: conv.status,
      stage: conv.stage,
      createdAt: conv.createdAt,
      escalatedAt: conv.escalatedAt,
      lastUserQuery: conv.lastUserQuery,
      lastMatchedEntry: conv.lastMatchedEntry,
      messages: conv.messages
    })) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/escalations/:sessionId/resolve', requireAdmin, async (req, res) => {
  try {
    const conv = await Conversation.findOne({ sessionId: req.params.sessionId });
    if (!conv) return res.status(404).json({ error: 'Escalation not found' });
    conv.status = 'resolved';
    conv.stage = 'resolved';
    conv.resolvedAt = new Date();
    await conv.save();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Socket.io ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('join_session', async ({ sessionId }) => {
    socket.join(sessionId);
    try {
      let conv = await Conversation.findOne({ sessionId });
      if (!conv) conv = await Conversation.create({ sessionId });
      socket.emit('session_ready', { sessionId, messages: conv.messages, stage: conv.stage });
    } catch {
      // MongoDB not running — start fresh in-memory session
      socket.emit('session_ready', { sessionId, messages: [], stage: 'fresh' });
    }
  });

  socket.on('user_message', async ({ sessionId, text }) => {
    if (!text?.trim()) return;

    // In-memory fallback if MongoDB is not connected
    let conv = null;
    try { conv = await Conversation.findOne({ sessionId }); } catch {}
    if (!conv) {
      conv = {
        sessionId, stage: 'fresh', status: 'active',
        lastMatchedEntry: null, lastUserQuery: text,
        messages: [],
        _inMemory: true,
        save: async () => {}
      };
    }

    conv.messages.push({ role: 'user', content: text, source: 'user' });
    conv.lastUserQuery = text;

    // Broadcast user message to other tabs in same session
    socket.to(sessionId).emit('message', { role: 'user', content: text, source: 'user' });

    try {
      // ── FOLLOWUP ─────────────────────────────────────────────────────────
      if (isFollowup(text)) {

        if (conv.stage === 'db_answered' && conv.lastMatchedEntry) {
          // → Tier 2: AI response
          socket.emit('bot_typing', { source: 'claude_ai' });
          try {
            const aiText = await callFreeAI(conv.lastMatchedEntry, conv.lastUserQuery);
            const botMsg = {
              role: 'bot', content: aiText, source: 'claude_ai',
              matchedQuery: conv.lastMatchedEntry.query,
              category: conv.lastMatchedEntry.category,
              aiProvider: geminiClient ? 'Gemini' : groqClient ? 'Groq' : 'built-in'
            };
            conv.messages.push(botMsg);
            conv.stage = 'ai_answered';
            await conv.save();
            socket.emit('bot_typing_stop');
            io.to(sessionId).emit('message', botMsg);

          } catch (aiErr) {
            console.error('AI error:', aiErr.message);
            socket.emit('bot_typing_stop');
            // Emit fallback then escalate
            const fallbackMsg = {
              role: 'bot', source: 'claude_ai',
              content: getBuiltInFallback(conv.lastMatchedEntry, conv.lastUserQuery),
              matchedQuery: conv.lastMatchedEntry.query,
              category: conv.lastMatchedEntry.category,
              aiProvider: 'built-in'
            };
            conv.messages.push(fallbackMsg);
            conv.stage = 'ai_answered';
            await conv.save();
            io.to(sessionId).emit('message', fallbackMsg);
          }

        } else if (conv.stage === 'ai_answered') {
          // → Tier 3: Escalate to IT team
          await doEscalate(conv, io, sessionId);

        } else {
          const sysMsg = { role:'bot', content:'Please describe your IT issue first so I can start troubleshooting.', source:'system' };
          conv.messages.push(sysMsg);
          await conv.save();
          io.to(sessionId).emit('message', sysMsg);
        }
        return;
      }

      // ── NEW QUERY ─────────────────────────────────────────────────────────
      socket.emit('bot_typing', { source: 'claude_ai' });
      await delay(500 + Math.random() * 400);

      const match = findMatch(text);
      const matchedEntry = match
        ? { id: match.id, query: match.q, category: match.cat }
        : { query: text, category: 'General Issue' };

      try {
        const aiText = await callFreeAI(matchedEntry, text);
        const botMsg = {
          role: 'bot', content: aiText, source: 'claude_ai',
          matchedQuery: matchedEntry.query, category: matchedEntry.category,
          aiProvider: geminiClient ? 'Gemini' : groqClient ? 'Groq' : 'built-in'
        };
        conv.messages.push(botMsg);
        conv.stage = 'ai_answered';
        conv.lastMatchedEntry = matchedEntry;
        await conv.save();
        socket.emit('bot_typing_stop');
        io.to(sessionId).emit('message', botMsg);
      } catch (aiErr) {
        console.error('AI error:', aiErr.message);
        socket.emit('bot_typing_stop');
        const fallbackMsg = {
          role: 'bot', content: getBuiltInFallback(matchedEntry, conv.lastUserQuery), source: 'claude_ai',
          matchedQuery: matchedEntry.query, category: matchedEntry.category,
          aiProvider: 'built-in'
        };
        conv.messages.push(fallbackMsg);
        conv.stage = 'ai_answered';
        conv.lastMatchedEntry = matchedEntry;
        await conv.save();
        io.to(sessionId).emit('message', fallbackMsg);
      }

    } catch (err) {
      console.error('Socket handler error:', err);
      socket.emit('bot_typing_stop');
      socket.emit('error_message', { text: 'An unexpected error occurred. Please try again.' });
    }
  });

  socket.on('disconnect', () => console.log(`🔌 Disconnected: ${socket.id}`));
});

// ── AI caller — tries Gemini first, then Groq, then built-in ─────────────
async function callFreeAI(matchedEntry, userQuery) {
  const prompt = buildPrompt(matchedEntry, userQuery);

  if (geminiClient) {
    // Google Gemini (free tier: gemini-1.5-flash)
    const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }

  if (groqClient) {
    // Groq (free tier: llama-3.1-8b-instant is very fast)
    const chat = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
      temperature: 0.4
    });
    return chat.choices[0].message.content.trim();
  }

  // No API key — use built-in fallback
  return getBuiltInFallback(matchedEntry, userQuery);
}

function containsNepanglish(text) {
  if (!text) return false;
  if (/[ऀ-ॿ]/.test(text)) return true;
  const nepKeywords = [
    'hudaina','cha','chha','chhaina','gari','garena','garda','bhat','bhayo','bhayena',
    'bolyo','khuldaina','khuldaina','chhaina','jasto','pani','thik','kaam','kam',
    'chhaina','nasakne','na sakne','hami','timi','tara','pani'
  ];
  const lower = text.toLowerCase();
  return nepKeywords.some(keyword => lower.includes(keyword));
}

function buildPrompt(matchedEntry, userQuery) {
  const isNepanglish = containsNepanglish(userQuery);
  const styleInstruction = isNepanglish
    ? 'Respond in simple Nepanglish with short, friendly sentences, like a helpful IT support agent chatting with the user.'
    : 'Respond in simple, clear English with short, friendly sentences, like a helpful IT support agent.';

  return `You are an expert IT support specialist. A user tried the standard company knowledge base answer for their issue and it did not resolve the problem.

${styleInstruction}

Issue: "${matchedEntry.query}"
Category: ${matchedEntry.category}
Standard answer already given: "${matchedEntry.query}"
What the user said: "${userQuery}"

Provide 3-5 NEW advanced troubleshooting steps that are NOT in the standard answer above.
Format as a numbered list. Be specific to this exact problem only.
End with: "If these steps still do not resolve your issue, please reply 'still not working' and I will escalate this to the IT team immediately."`;
}

// ── Built-in fallback responses (no API key needed) ───────────────────────
const FALLBACK_BY_CATEGORY = {
  'Password Issue':    '1. Try using a private/incognito browser window to reset your password.\n2. Clear your browser cache and cookies before attempting the reset.\n3. Check if Caps Lock is on when entering your new password.\n4. Try a different browser entirely.\n5. Contact HR to verify your registered email address is correct.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
  'Network Issue':     '1. Check if the issue is specific to one device or all devices on the network.\n2. Flush your DNS cache by opening Command Prompt and running: ipconfig /flushdns\n3. Change your DNS server to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare) in your network settings.\n4. Disable any browser extensions or firewall software temporarily to test.\n5. Run the Windows Network Troubleshooter from Settings → System → Troubleshoot.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
  'Email Issue':       '1. Check if the issue occurs in Outlook Web App (OWA) at mail.company.com to isolate whether it is a desktop app or server issue.\n2. Delete your Outlook profile and recreate it from Control Panel → Mail → Show Profiles.\n3. Run Outlook with the command: outlook.exe /safe to launch in safe mode.\n4. Check if your mailbox quota is full under File → Info → Mailbox Settings.\n5. Repair the Office installation from Control Panel → Programs → Microsoft Office → Change → Repair.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
  'Hardware Issue':    '1. Run the Windows Memory Diagnostic tool by searching for it in the Start menu.\n2. Check Device Manager for any yellow warning icons indicating driver issues.\n3. Run an SFC scan: open Command Prompt as Administrator and type sfc /scannow\n4. Check Event Viewer (search in Start menu) under Windows Logs → System for recent critical errors.\n5. Run the built-in hardware diagnostics by pressing F12 during startup (on Dell) or F2 (on HP/Lenovo).\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
  'Software Issue':    '1. Uninstall the application completely, then reinstall using the latest version from the company software portal.\n2. Check Windows Event Viewer for application-specific crash logs to identify the exact error.\n3. Run the application as Administrator by right-clicking and selecting Run as Administrator.\n4. Check if the issue occurs under a different Windows user account to rule out a profile corruption.\n5. Ensure all pending Windows Updates are installed, then restart and test again.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
  'Printer Issue':     '1. Delete all jobs from the print queue: open Services, stop the Print Spooler service, delete files in C:\\Windows\\System32\\spool\\PRINTERS, then restart the service.\n2. Uninstall the printer driver completely from Device Manager, download the latest driver from the manufacturer website and reinstall.\n3. Try printing a test page directly from the printer\'s control panel to rule out a computer issue.\n4. Check the printer IP address has not changed by printing a configuration page from the printer.\n5. Try connecting the printer directly via USB cable to isolate a network issue.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
  'Security Alert':    '1. Immediately disconnect the affected device from the company network (unplug ethernet / disable WiFi).\n2. Do not open any files, emails, or applications until cleared by the security team.\n3. Take a screenshot or photo of any suspicious activity for the security team\'s investigation.\n4. Change your passwords from a different, unaffected device immediately.\n5. Check your email account for any sent messages or rules you did not create.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
  'Performance Issue': '1. Press Ctrl+Shift+Esc to open Task Manager and sort by CPU and Memory to identify resource-heavy processes.\n2. Run Disk Cleanup (search in Start menu) and also clean System Files for more space.\n3. Disable startup programs: Task Manager → Startup tab → disable anything unnecessary.\n4. Run a full malware scan using Windows Defender: Settings → Windows Security → Virus & threat protection.\n5. Check if your drive health is failing using CrystalDiskInfo (free tool) or the built-in SMART data.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.',
};

function getBuiltInFallback(matchedEntry, userQuery) {
  return FALLBACK_BY_CATEGORY[matchedEntry.category] ||
    '1. Restart the affected service or application completely.\n2. Check Windows Event Viewer for specific error codes related to your issue.\n3. Ensure all Windows Updates and driver updates are installed.\n4. Try reproducing the issue under a different Windows user account.\n5. Run the built-in Windows Troubleshooter for this type of issue from Settings → Troubleshoot.\n\nIf these steps still do not resolve your issue, please reply "still not working" and I will escalate this to the IT team immediately.';
}

// ── Escalate to IT team ───────────────────────────────────────────────────
async function doEscalate(conv, io, sessionId) {
  const escMsg = {
    role: 'bot', source: 'escalation',
    content: `Both the knowledge base and advanced troubleshooting steps were unable to resolve the issue${conv.lastMatchedEntry ? ` "${conv.lastMatchedEntry.query}"` : ''}. A priority support ticket has been raised and an IT specialist will contact you within 2 hours. Please keep your device on and available.`
  };
  conv.messages.push(escMsg);
  conv.stage = 'escalated';
  conv.status = 'escalated';
  conv.escalatedAt = new Date();
  try { await conv.save(); } catch {}
  io.to(sessionId).emit('message', escMsg);
  console.log(`🚨 Escalated session: ${sessionId}`);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 IT Support Chatbot running at http://localhost:${PORT}`);
  console.log(`   AI Provider: ${geminiClient ? 'Google Gemini (free)' : groqClient ? 'Groq (free)' : 'Built-in fallback (no API key)'}`);
  console.log(`   Frontend:    http://localhost:3000\n`);
});
