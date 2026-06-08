import React from 'react';
import { useSocket } from '../context/SocketContext';

export default function Sidebar() {
  const { messages, stage, connected, sendMessage, clearSession } = useSocket();
  const recentChats = Array.from(
    new Map(
      messages
        .filter(m => m.role === 'user')
        .reverse()
        .map(m => [m.content, m])
    ).values()
  ).slice(0, 6);

  return (
    <aside style={{ width:240, flexShrink:0, background:'#13161d',
      borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex',
      flexDirection:'column', overflowY:'auto', padding:'20px 16px', gap:24 }}>

      {/* Connection status */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:'50%',
            background: connected ? '#34d48a' : '#f25c5c',
            boxShadow: connected ? '0 0 6px #34d48a' : '0 0 6px #f25c5c',
            display:'inline-block', animation:'pulse 2s infinite' }} />
          <span style={{ fontSize:12, color:'#7b8099' }}>{connected ? 'Connected' : 'Reconnecting...'}</span>
        </div>
        <button onClick={clearSession} title="New session"
          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:6, padding:'3px 8px', color:'#7b8099', fontSize:11, cursor:'pointer' }}>
          New session
        </button>
      </div>

      {/* Current stage */}
      {stage !== 'fresh' && (
        <div>
          <div style={sectionTitle}>Current stage</div>
          <div style={{ padding:'8px 12px', borderRadius:8, background:'#1a1e28',
            border:'1px solid rgba(255,255,255,0.07)', fontSize:12 }}>
            {stage === 'db_answered'  && <><span style={{ color:'#4f8ef7' }}>●</span> KB answer given — say <em style={{ color:'#7b8099' }}>still not working</em> for AI step</>}
            {stage === 'ai_answered'  && <><span style={{ color:'#a78bfa' }}>●</span> AI answer given — say <em style={{ color:'#7b8099' }}>still not working</em> to escalate</>}
            {stage === 'escalated'    && <><span style={{ color:'#f25c5c' }}>●</span> Ticket raised — IT team notified</>}
          </div>
        </div>
      )}

      {recentChats.length > 0 && (
        <div>
          <div style={sectionTitle}>Recent chats</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {recentChats.map((chat, index) => (
              <button key={index} onClick={() => sendMessage(chat.content)}
                style={{ width:'100%', textAlign:'left', padding:'10px 12px',
                  borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
                  background:'#161a22', color:'#e8eaf0', cursor:'pointer',
                  fontSize:12, lineHeight:1.4 }}>
                {chat.content.length > 42 ? `${chat.content.slice(0, 42)}...` : chat.content}
              </button>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}

const sectionTitle = {
  fontSize:10, fontWeight:600, letterSpacing:0.8, textTransform:'uppercase',
  color:'#4a5068', marginBottom:10
};
