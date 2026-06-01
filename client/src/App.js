import React from 'react';
import { SocketProvider } from './context/SocketContext';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';

// Global styles
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0d0f14; color: #e8eaf0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #212638; border-radius: 4px; }
  @keyframes fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
  @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes tdot   { 0%,80%,100% { opacity:0.2; transform:scale(0.8); } 40% { opacity:1; transform:scale(1); } }
`;

function TopBar({ admin }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 28px', height:60, background:'#13161d',
      borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(79,142,247,0.12)',
          border:'1px solid rgba(79,142,247,0.28)', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:16 }}>{admin ? '🛠️' : '🖥️'}</div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, letterSpacing:-0.2, color:'#e8eaf0' }}>{admin ? 'IT Escalation Dashboard' : 'IT Support Assistant'}</div>
          <div style={{ fontSize:12, color:'#7b8099' }}>{admin ? 'Admin-only escalation queue' : '62 queries · Node.js + React + Socket.io + MongoDB + Claude AI'}</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:'#34d48a',
          boxShadow:'0 0 6px #34d48a', display:'inline-block', animation:'pulse 2s infinite' }} />
        <span style={{ fontSize:12, color:'#7b8099' }}>System online</span>
      </div>
    </div>
  );
}

export default function App() {
  const pathname = window.location.pathname;
  const isAdmin = pathname.startsWith('/admin');

  return (
    <SocketProvider>
      <style>{globalCSS}</style>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <TopBar admin={isAdmin} />
        {isAdmin ? <AdminDashboard /> : <ChatPage />}
      </div>
    </SocketProvider>
  );
}
