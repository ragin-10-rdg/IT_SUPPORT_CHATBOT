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
        Describe your IT issue and I’ll respond with the best available support steps.
      </p>
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
