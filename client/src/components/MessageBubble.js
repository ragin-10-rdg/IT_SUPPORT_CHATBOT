import React from 'react';

const COL_MAP = {
  blue:   { text:'#4f8ef7', bg:'rgba(79,142,247,0.12)',  border:'rgba(79,142,247,0.28)'  },
  green:  { text:'#34d48a', bg:'rgba(52,212,138,0.12)',  border:'rgba(52,212,138,0.28)'  },
  purple: { text:'#a78bfa', bg:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.28)' },
  amber:  { text:'#f5a623', bg:'rgba(245,166,35,0.12)',  border:'rgba(245,166,35,0.28)'  },
  red:    { text:'#f25c5c', bg:'rgba(242,92,92,0.12)',   border:'rgba(242,92,92,0.28)'   },
  teal:   { text:'#2dd4bf', bg:'rgba(45,212,191,0.12)',  border:'rgba(45,212,191,0.28)'  },
};

function cleanText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\s+$/, '')
    .trim();
}

function parseSteps(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const steps = [];
  let current = '';
  for (const line of lines) {
    const trimmed = line.trim();
    const m = /^(\d+)[.)]\s+(.+)/.exec(trimmed);
    if (m) {
      if (current) steps.push(cleanText(current));
      current = m[2];
    } else if (current && !trimmed.toLowerCase().startsWith('if these steps')) {
      current += ' ' + trimmed;
    }
  }
  if (current) steps.push(cleanText(current));
  return steps;
}

function Notice({ type, icon, text }) {
  const s = {
    red:    { bg:'rgba(242,92,92,0.1)',   border:'rgba(242,92,92,0.3)',   color:'#f25c5c' },
    green:  { bg:'rgba(52,212,138,0.1)',  border:'rgba(52,212,138,0.3)',  color:'#34d48a' },
    blue:   { bg:'rgba(79,142,247,0.1)',  border:'rgba(79,142,247,0.3)',  color:'#4f8ef7' },
    purple: { bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.3)', color:'#a78bfa' },
    amber:  { bg:'rgba(245,166,35,0.1)',  border:'rgba(245,166,35,0.3)',  color:'#f5a623' },
  }[type] || {};
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'8px 12px',
      borderRadius:8, marginTop:10, background:s.bg, border:`1px solid ${s.border}`,
      color:s.color, fontSize:12.5, fontWeight:500 }}>
      <span style={{ marginTop:1, flexShrink:0 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function BotAvatar({ source }) {
  const cfg = {
    database:   { bg:'rgba(79,142,247,0.12)',  border:'rgba(79,142,247,0.3)',  emoji:'🖥️' },
    ai:         { bg:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.3)', emoji:'✦'  },
    claude_ai:  { bg:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.3)', emoji:'✦'  },
    escalation: { bg:'rgba(242,92,92,0.12)',   border:'rgba(242,92,92,0.3)',   emoji:'🚨' },
    system:     { bg:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', emoji:'ℹ️' },
  }[source] || { bg:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', emoji:'💬' };
  return (
    <div style={{ width:30, height:30, borderRadius:'50%', background:cfg.bg,
      border:`1px solid ${cfg.border}`, display:'flex', alignItems:'center',
      justifyContent:'center', fontSize:13, flexShrink:0, marginTop:2 }}>
      {cfg.emoji}
    </div>
  );
}

function StepList({ steps, numColor, numBg, numBorder }) {
  return (
    <ol style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:7, margin:0, padding:0 }}>
      {steps.map((s, i) => (
        <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
          <span style={{ minWidth:20, height:20, borderRadius:'50%', background:numBg,
            border:`1px solid ${numBorder}`, color:numColor, fontSize:10, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            marginTop:2, fontFamily:'monospace' }}>{i+1}</span>
          <span style={{ fontSize:13.5, lineHeight:1.65, color:'#e8eaf0' }}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

// ── User bubble ──────────────────────────────────────────────────────────
function UserBubble({ content }) {
  return (
    <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16, animation:'fadein 0.2s ease', alignItems:'flex-start', gap:10 }}>
      <div style={{ maxWidth:'72%', padding:'11px 16px', borderRadius:14, borderTopRightRadius:4,
        background:'#4f8ef7', color:'#fff', fontSize:14, lineHeight:1.6 }}>{content}</div>
      <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(52,212,138,0.15)',
        border:'1px solid rgba(52,212,138,0.3)', display:'flex', alignItems:'center',
        justifyContent:'center', color:'#34d48a', fontSize:10, fontWeight:700, flexShrink:0, marginTop:2 }}>ME</div>
    </div>
  );
}

// ── DB bubble ────────────────────────────────────────────────────────────
function DBBubble({ msg }) {
  const col = COL_MAP[msg.col] || COL_MAP.blue;
  const steps = parseSteps(msg.content);
  return (
    <div style={{ display:'flex', gap:10, marginBottom:16, animation:'fadein 0.2s ease' }}>
      <BotAvatar source="database" />
      <div style={{ maxWidth:'76%', padding:'13px 16px', borderRadius:14, borderTopLeftRadius:4,
        background:'#13161d', border:'1px solid rgba(255,255,255,0.1)', color:'#e8eaf0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.5, padding:'2px 8px', borderRadius:999,
            background:'rgba(79,142,247,0.12)', color:'#4f8ef7', border:'1px solid rgba(79,142,247,0.3)', textTransform:'uppercase' }}>
            📋 Knowledge Base
          </span>
          <span style={{ fontSize:10.5, fontWeight:600, padding:'2px 9px', borderRadius:999,
            background:col.bg, color:col.text, border:`1px solid ${col.border}` }}>{msg.category}</span>
        </div>
        {steps.length > 1 ? (
          <>
            <p style={{ fontSize:13, color:'#7b8099', marginBottom:8 }}>
              Steps for: <strong style={{ color:'#e8eaf0' }}>{msg.matchedQuery}</strong>
            </p>
            <StepList steps={steps} numColor="#4f8ef7" numBg="rgba(79,142,247,0.15)" numBorder="rgba(79,142,247,0.3)" />
          </>
        ) : (
          <p style={{ fontSize:13.5, lineHeight:1.65 }}>{msg.content}</p>
        )}
        {msg.autoEscalate && (
          <Notice type="red" icon="⚠️"
            text={msg.category?.toLowerCase().includes('security')
              ? 'Security incident — escalating to cybersecurity team immediately.'
              : 'This issue requires IT escalation — a support ticket will be raised.'} />
        )}
        <p style={{ fontSize:12, color:'#4a5068', marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          If these steps didn't help, reply <code style={{ background:'#1a1e28', padding:'1px 6px', borderRadius:4, color:'#7b8099', fontSize:11 }}>still not working</code> for AI-powered advanced troubleshooting.
        </p>
      </div>
    </div>
  );
}

// ── AI bubble ────────────────────────────────────────────────────────────
function AIBubble({ msg }) {
  const steps = parseSteps(msg.content);
  const closingLine = msg.content.split('\n').find(l => l.toLowerCase().includes('if these steps still'));
  return (
    <div style={{ display:'flex', gap:10, marginBottom:16, animation:'fadein 0.2s ease' }}>
      <BotAvatar source="ai" />
      <div style={{ maxWidth:'76%', padding:'13px 16px', borderRadius:14, borderTopLeftRadius:4,
        background:'#13161d', border:'1px solid rgba(167,139,250,0.25)', color:'#e8eaf0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:10.5, fontWeight:600, padding:'2px 9px', borderRadius:999,
            background:'rgba(167,139,250,0.1)', color:'#a78bfa', border:'1px solid rgba(167,139,250,0.25)' }}>
            {msg.category} — Advanced
          </span>
        </div>
        <p style={{ fontSize:12.5, color:'#7b8099', marginBottom:10 }}>
          Standard steps didn't resolve <strong style={{ color:'#e8eaf0' }}>{msg.matchedQuery}</strong>. Advanced troubleshooting:
        </p>
        {steps.length > 1 ? (
          <StepList steps={steps} numColor="#a78bfa" numBg="rgba(167,139,250,0.15)" numBorder="rgba(167,139,250,0.3)" />
        ) : (
          <p style={{ fontSize:13.5, lineHeight:1.7 }}>{msg.content}</p>
        )}
        <p style={{ fontSize:12, color:'#4a5068', marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          {closingLine || <>If these advanced steps still didn't help, reply <code style={{ background:'#1a1e28', padding:'1px 6px', borderRadius:4, color:'#7b8099', fontSize:11 }}>still not working</code> to escalate to the IT team.</>}
        </p>
      </div>
    </div>
  );
}

// ── Escalation bubble ────────────────────────────────────────────────────
function EscalationBubble({ msg }) {
  return (
    <div style={{ display:'flex', gap:10, marginBottom:16, animation:'fadein 0.2s ease' }}>
      <BotAvatar source="escalation" />
      <div style={{ maxWidth:'76%', padding:'13px 16px', borderRadius:14, borderTopLeftRadius:4,
        background:'#13161d', border:'1px solid rgba(242,92,92,0.3)', color:'#e8eaf0' }}>
        <Notice type="red" icon="🚨" text="Escalating to the IT team now — priority ticket raised." />
        <p style={{ fontSize:13.5, lineHeight:1.7, marginTop:10 }}>{msg.content}</p>
        <Notice type="green" icon="✅" text="Ticket raised · IT team notified · Expected response within 2 hours" />
        <p style={{ fontSize:12, color:'#4a5068', marginTop:8 }}>Please keep your device on and available for the IT specialist.</p>
      </div>
    </div>
  );
}

// ── System bubble ────────────────────────────────────────────────────────
function SystemBubble({ msg }) {
  return (
    <div style={{ display:'flex', gap:10, marginBottom:16, animation:'fadein 0.2s ease' }}>
      <BotAvatar source="system" />
      <div style={{ maxWidth:'76%', padding:'11px 16px', borderRadius:14, borderTopLeftRadius:4,
        background:'#13161d', border:'1px solid rgba(255,255,255,0.08)', color:'#7b8099', fontSize:13.5, lineHeight:1.6 }}>
        {msg.content}
      </div>
    </div>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────
export function TypingIndicator({ source }) {
  const isAI = source === 'ai' || source === 'claude_ai';
  const color = isAI ? '#a78bfa' : '#4f8ef7';
  const label = isAI ? 'AI generating advanced steps...' : 'Searching knowledge base...';
  return (
    <div style={{ display:'flex', gap:10, marginBottom:16, animation:'fadein 0.2s ease' }}>
      <BotAvatar source={isAI ? 'ai' : 'database'} />
      <div style={{ padding:'11px 16px', borderRadius:14, borderTopLeftRadius:4,
        background:'#13161d', border:`1px solid ${isAI ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
        <div style={{ fontSize:11, color, marginBottom:6, fontFamily:'monospace' }}>{label}</div>
        <div style={{ display:'flex', gap:5, alignItems:'center' }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:color,
              animation:`tdot 1.3s ${i*0.2}s infinite`, opacity:0.4, display:'block' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main dispatcher ──────────────────────────────────────────────────────
export default function MessageBubble({ msg }) {
  if (msg.role === 'user')         return <UserBubble content={msg.content} />;
  if (msg.source === 'database')   return <DBBubble msg={msg} />;
  if (msg.source === 'ai' || msg.source === 'claude_ai') return <AIBubble msg={msg} />;
  if (msg.source === 'escalation') return <EscalationBubble msg={msg} />;
  return <SystemBubble msg={msg} />;
}
