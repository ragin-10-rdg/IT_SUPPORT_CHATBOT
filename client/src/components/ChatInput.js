import React, { useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export default function ChatInput() {
  const { sendMessage, isTyping, stage } = useSocket();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || isTyping) return;
    sendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const hintText = {
    fresh:       'Describe your IT issue… AI will provide advanced troubleshooting by default.',
    db_answered: 'Reply "still not working" for AI-powered advanced troubleshooting…',
    ai_answered: 'Reply "still not working" to escalate to the IT team…',
    escalated:   'Issue escalated — ticket has been raised with the IT team',
  }[stage] || 'Describe your IT issue… AI will provide advanced troubleshooting by default.';

  const disabled = isTyping || stage === 'escalated';

  return (
    <div style={{ padding:'16px 28px 20px', background:'#0d0f14',
      borderTop:'1px solid rgba(255,255,255,0.07)' }}>

      <div style={{ display:'flex', gap:10, alignItems:'flex-end', background:'#13161d',
        border:`1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius:12, padding:'10px 12px 10px 16px',
        transition:'border-color 0.2s', outline:'none' }}>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={hintText}
          rows={1}
          style={{ flex:1, background:'transparent', border:'none', outline:'none',
            fontFamily:'inherit', fontSize:14, color: disabled ? '#4a5068' : '#e8eaf0',
            resize:'none', minHeight:22, maxHeight:120, lineHeight:1.5 }}
        />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          style={{ width:34, height:34, borderRadius:8,
            background: (disabled || !text.trim()) ? 'rgba(79,142,247,0.3)' : '#4f8ef7',
            border:'none', cursor: (disabled || !text.trim()) ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0, transition:'all 0.15s' }}>
          <svg viewBox="0 0 24 24" style={{ width:15, height:15, stroke:'#fff', fill:'none', strokeWidth:2.2, strokeLinecap:'round', strokeLinejoin:'round' }}>
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <div style={{ fontSize:11, color:'#4a5068', marginTop:8, textAlign:'center' }}>
        {stage === 'fresh' && 'AI will answer your query first. Reply "still not working" to escalate.'}
        {stage === 'db_answered' && <span>KB answer shown · say <code style={{ background:'#1a1e28', padding:'1px 5px', borderRadius:4, color:'#7b8099' }}>still not working</code> for AI step</span>}
        {stage === 'ai_answered' && <span>AI answer shown · say <code style={{ background:'#1a1e28', padding:'1px 5px', borderRadius:4, color:'#7b8099' }}>still not working</code> to escalate</span>}
        {stage === 'escalated' && 'IT team has been notified — a specialist will contact you shortly'}
      </div>
    </div>
  );
}
