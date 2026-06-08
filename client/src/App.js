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

function ImeLogo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:34, height:34, borderRadius:10, background:'#db121d', display:'flex', alignItems:'center',
        justifyContent:'center', color:'#ffffff', fontSize:12, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase' }}>
        IME
      </div>
      <div>
        <div style={{ fontSize:15, fontWeight:700, letterSpacing:-0.2, color:'#e8eaf0' }}>IME group</div>
        <div style={{ fontSize:11, color:'#f4f4f4', opacity:0.85 }}>pioneering spirit</div>
      </div>
    </div>
  );
}

function TopBar({ admin }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 28px', height:60, background:'#13161d',
      borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <ImeLogo />
        <div>
          <div style={{ fontSize:15, fontWeight:600, letterSpacing:-0.2, color:'#e8eaf0' }}>{admin ? 'IT Escalation Dashboard' : 'IME Group IT Support'}</div>
          <div style={{ fontSize:12, color:'#7b8099' }}>{admin ? 'Admin-only escalation queue' : 'Chatbot for IME Group IT support'}</div>
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
