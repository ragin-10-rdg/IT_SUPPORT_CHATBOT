import React from 'react';
import { useSocket } from '../context/SocketContext';
import MessageBubble, { TypingIndicator } from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import Sidebar from '../components/Sidebar';
import { useAutoScroll } from '../hooks/useAutoScroll';

function Welcome() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      flex:1, padding:'40px 24px', textAlign:'center', gap:8 }}>
      <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(79,142,247,0.12)',
        border:'1px solid rgba(79,142,247,0.3)', display:'flex', alignItems:'center',
        justifyContent:'center', fontSize:24, marginBottom:8 }}>🖥️</div>
      <h3 style={{ fontSize:20, fontWeight:600, color:'#e8eaf0', margin:0 }}>How can I help you today?</h3>
      <p style={{ fontSize:13.5, color:'#7b8099', maxWidth:360, lineHeight:1.65, margin:'4px 0 20px' }}>
        Describe your IT issue and I'll work through three levels of support to get it resolved.
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:6, width:'100%', maxWidth:360 }}>
        {[
          { num:'1', label:'Knowledge Base answer', sub:'Exact response from your 62-entry IT database', c:'#4f8ef7', bg:'rgba(79,142,247,0.12)', br:'rgba(79,142,247,0.3)' },
          { num:'2', label:'Claude AI answer',      sub:'Deeper AI troubleshooting if still unresolved',  c:'#a78bfa', bg:'rgba(167,139,250,0.12)', br:'rgba(167,139,250,0.3)' },
          { num:'3', label:'IT Team escalation',    sub:'Priority ticket raised, specialist assigned',    c:'#f25c5c', bg:'rgba(242,92,92,0.12)',   br:'rgba(242,92,92,0.3)'   },
        ].map((f, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
            borderRadius:10, background:'#13161d', border:'1px solid rgba(255,255,255,0.07)', textAlign:'left' }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:f.bg, border:`1px solid ${f.br}`,
              color:f.c, fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, fontFamily:'monospace' }}>{f.num}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#e8eaf0' }}>{f.label}</div>
              <div style={{ fontSize:11.5, color:'#7b8099' }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { messages, isTyping, typingSource } = useSocket();
  const scrollRef = useAutoScroll([messages, isTyping]);

  return (
    <div style={{ display:'flex', flex:1, overflow:'hidden', height:'calc(100vh - 60px)' }}>
      <Sidebar />

      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'#0d0f14' }}>
        <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'28px 32px',
          display:'flex', flexDirection:'column', scrollBehavior:'smooth' }}>

          {messages.length === 0 ? (
            <Welcome />
          ) : (
            <>
              {messages.map((msg, i) => <MessageBubble key={msg._id || i} msg={msg} />)}
              {isTyping && <TypingIndicator source={typingSource} />}
            </>
          )}
        </div>

        <ChatInput />
      </main>
    </div>
  );
}
