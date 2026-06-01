import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const SocketContext = createContext(null);

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [sessionId]  = useState(() => {
    const stored = localStorage.getItem('it_support_session');
    if (stored) return stored;
    const id = uuidv4();
    localStorage.setItem('it_support_session', id);
    return id;
  });
  const [messages,    setMessages]    = useState([]);
  const [stage,       setStage]       = useState('fresh');
  const [isTyping,    setIsTyping]    = useState(false);
  const [typingSource,setTypingSource]= useState('database');

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Server sends back history + current stage
    socket.on('session_ready', ({ messages: hist, stage: s }) => {
      setMessages(hist || []);
      setStage(s || 'fresh');
    });

    // New message (from this socket or another tab)
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, { ...msg, _id: msg._id || uuidv4() }]);
      if (msg.source !== 'user') {
        // Update stage based on source
        if (msg.source === 'database')  setStage('db_answered');
        if (msg.source === 'claude_ai') setStage('ai_answered');
        if (msg.source === 'escalation') setStage('escalated');
      }
    });

    socket.on('bot_typing',      ({ source }) => { setIsTyping(true);  setTypingSource(source); });
    socket.on('bot_typing_stop', ()            => { setIsTyping(false); });
    socket.on('error_message',   ({ text })    => {
      setMessages(prev => [...prev, { role: 'bot', content: text, source: 'system', _id: uuidv4() }]);
      setIsTyping(false);
    });

    // Join session
    socket.emit('join_session', { sessionId });

    return () => socket.disconnect();
  }, [sessionId]);

  const sendMessage = (text) => {
    if (!text.trim() || !socketRef.current) return;
    const userMsg = { role: 'user', content: text, source: 'user', _id: uuidv4(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    socketRef.current.emit('user_message', { sessionId, text });
  };

  const clearSession = () => {
    localStorage.removeItem('it_support_session');
    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      connected, sessionId, messages, stage,
      isTyping, typingSource, sendMessage, clearSession
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
