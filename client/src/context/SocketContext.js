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
    const clean = text.trim();

    // Detect phrases that indicate the user confirmed the problem is solved.
    // Include Nepali confirmations and common English variants like
    // "it's working", "its working", "thank you", "thanks", "solved", "fixed".
    const solvedRe = /\b(kaam garyo|bhayo|chalyo|its working|it's working|it is working|thank you|thanks|solved|fixed|working now)\b/i;
    const userMsg = { role: 'user', content: clean, source: 'user', _id: uuidv4(), timestamp: new Date() };
    // If the user indicates the issue is solved, append the user message and
    // a single thank-you system reply locally and avoid the normal
    // troubleshooting flow on the server.
    if (solvedRe.test(clean)) {
      setMessages(prev => [...prev, userMsg]);
      const thanks = {
        role: 'bot',
        content: "Glad to hear it's working — kaam garyo! Thank you for contacting IT Support. We're always here to help if you need anything else.",
        source: 'system',
        _id: uuidv4(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, thanks]);
      // Emit a lightweight solved event so the server can log if it wants to.
      socketRef.current.emit('user_solved', { sessionId, text: clean });
      // Optionally update local stage to prevent further escalation UI.
      setStage('fresh');
      return;
    }

    // Normal flow: send message to server to trigger KB/AI handling
    setMessages(prev => [...prev, userMsg]);
    socketRef.current.emit('user_message', { sessionId, text: clean });
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
