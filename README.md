# IT Support Chatbot — Full Stack (Free AI APIs)

A production-ready IT support chatbot using **Node.js**, **React**, **Socket.io**, **MongoDB**, and **free AI APIs** (Google Gemini or Groq).

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend                      │
│  ChatPage · MessageBubble · Sidebar · ChatInput     │
│  SocketContext (WebSocket + session state)           │
└─────────────────┬───────────────────────────────────┘
                  │  Socket.io (real-time)
┌─────────────────▼───────────────────────────────────┐
│             Node.js + Express Server                 │
│  REST API  → /api/session /api/history /api/status  │
│  Socket.io → join_session · user_message            │
│  Free AI   → Google Gemini OR Groq (Tier 2)         │
└─────────────────┬───────────────────────────────────┘
                  │  Mongoose
┌─────────────────▼───────────────────────────────────┐
│                   MongoDB                            │
│  conversations → messages[] · stage · status        │
└─────────────────────────────────────────────────────┘
```

---

## Free AI Providers

| Provider | Model | Free Limit | Sign-up |
|----------|-------|-----------|---------|
| **Google Gemini** ⭐ Recommended | gemini-1.5-flash | 15 req/min · 1,500/day | https://aistudio.google.com/app/apikey |
| **Groq** | llama-3.1-8b-instant | 30 req/min | https://console.groq.com |

You only need **one** key. The bot auto-detects which one you have.
If neither key is set, it uses built-in fallback responses (no API needed).

---

## 3-Tier Resolution Flow

| Tier | Trigger | What happens |
|------|---------|-------------|
| **1** | New issue typed | Exact answer from your 62-entry knowledge base |
| **2** | "still not working" | Free AI generates advanced troubleshooting steps |
| **3** | "still not working" again | Priority IT ticket raised, specialist notified |

---

## Prerequisites

- **Node.js** v18+ → https://nodejs.org (download LTS)
- **MongoDB Community** → https://www.mongodb.com/try/download/community
- **One free API key** → Gemini (recommended) or Groq

---

## Setup — Step by Step

### 1. Extract and open in VS Code
Unzip the project, then in VS Code: File → Open Folder → select `it-support-chatbot`

### 2. Create your .env file
In the VS Code terminal (Ctrl + `):
```bash
copy .env.example .env
```
Open `.env` and fill in your key:
```env
GEMINI_API_KEY=paste_your_gemini_key_here
MONGODB_URI=mongodb://localhost:27017/it_support_chatbot
PORT=5000
NODE_ENV=development
```

### 3. Install all dependencies
```bash
npm run install:all
```

### 4. Start MongoDB
MongoDB runs automatically as a Windows service after installation.
To check / start manually:
```bash
net start MongoDB
```

### 5. Run the project
```bash
npm run dev
```
Opens automatically on **http://localhost:3000**

---

## Getting Your Free API Key

### Google Gemini (Recommended)
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy it into `.env` as `GEMINI_API_KEY`

### Groq (Alternative)
1. Go to https://console.groq.com
2. Create a free account
3. Click **API Keys** → **Create API Key**
4. Copy it into `.env` as `GROQ_API_KEY`

---

## Project Structure

```
it-support-chatbot/
├── .env.example
├── package.json              ← npm run dev / install:all / start
├── server/
│   ├── index.js              ← Express + Socket.io + Free AI caller
│   ├── models.js             ← MongoDB schemas
│   └── knowledgeBase.js      ← 62-entry IT knowledge base
└── client/
    └── src/
        ├── App.js
        ├── context/SocketContext.js
        ├── components/
        │   ├── MessageBubble.js
        │   ├── Sidebar.js
        │   └── ChatInput.js
        └── pages/ChatPage.js
```

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start both server + React (development) |
| `npm run build` | Build React for production |
| `npm start` | Run server only (production) |
| `npm run install:all` | Install all dependencies (run once) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 3000 in use | Close other React apps or restart PC |
| MongoDB error | Run `net start MongoDB` in terminal |
| Gemini 429 error | You hit the free limit (1,500/day) — switch to Groq |
| AI not responding | Check your key in `.env` has no spaces around it |
| Blank screen | Wait 30s — React is still compiling |
