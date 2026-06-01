import React from 'react';
import { useSocket } from '../context/SocketContext';

const QUICK_ISSUES = [
  { label: 'Forgot password',     query: 'I forgot my password',                    color: '#4f8ef7' },
  { label: 'VPN not connecting',  query: 'VPN is not connecting',                   color: '#34d48a' },
  { label: 'Outlook issues',      query: 'Outlook is not opening',                  color: '#a78bfa' },
  { label: 'Suspicious email',    query: 'I received a suspicious email',            color: '#f25c5c' },
  { label: 'Laptop overheating',  query: 'Laptop is overheating',                   color: '#f5a623' },
  { label: 'Slow performance',    query: 'System is running very slowly',            color: '#7b8099' },
  { label: 'Shared drive access', query: 'Cannot access shared drive',              color: '#a78bfa' },
  { label: 'Blue screen error',   query: 'Blue screen error after update',           color: '#f25c5c' },
  { label: 'Teams crashing',      query: 'Teams keep crashing during meetings',      color: '#f5a623' },
  { label: 'Cannot print',        query: 'I cannot print documents',                 color: '#2dd4bf' },
];

const FLOW = [
  { num:'1', label:'Knowledge Base', sub:'Exact answer from your 62-entry IT database', color:'#4f8ef7', bg:'rgba(79,142,247,0.12)', border:'rgba(79,142,247,0.28)' },
  { num:'2', label:'Claude AI',      sub:'Advanced AI troubleshooting if unresolved',   color:'#a78bfa', bg:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.28)' },
  { num:'3', label:'IT Team',        sub:'Priority ticket raised, specialist assigned',  color:'#f25c5c', bg:'rgba(242,92,92,0.12)',   border:'rgba(242,92,92,0.28)'   },
];

function StatCard({ value, label, color }) {
  return (
    <div style={{ background:'#1a1e28', border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:8, padding:'12px 14px' }}>
      <div style={{ fontSize:22, fontWeight:600, fontFamily:'monospace', color: color || '#e8eaf0' }}>{value}</div>
      <div style={{ fontSize:11, color:'#7b8099', marginTop:2 }}>{label}</div>
    </div>
  );
}

export default function Sidebar() {
  const { messages, stage, connected, sendMessage, clearSession } = useSocket();

  const total     = messages.filter(m => m.role === 'user').length;
  const resolved  = messages.filter(m => m.source === 'database' && !m.autoEscalate).length;
  const escalated = messages.filter(m => m.source === 'escalation').length;

  return (
    <aside style={{ width:260, flexShrink:0, background:'#13161d',
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

      {/* Stats */}
      <div>
        <div style={sectionTitle}>Session stats</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <StatCard value={62}       label="KB entries"  color="#4f8ef7" />
          <StatCard value={total}    label="Queries"     />
          <StatCard value={resolved} label="Resolved"    color="#34d48a" />
          <StatCard value={escalated}label="Escalated"   color="#f25c5c" />
        </div>
      </div>

      {/* Resolution flow */}
      <div>
        <div style={sectionTitle}>Resolution flow</div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {FLOW.map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
              borderRadius:8, background:'#1a1e28', border:`1px solid rgba(255,255,255,0.07)` }}>
              <div style={{ width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0,
                background:f.bg, color:f.color, border:`1px solid ${f.border}` }}>{f.num}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'#e8eaf0' }}>{f.label}</div>
                <div style={{ fontSize:10.5, color:'#7b8099', lineHeight:1.4 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
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

      {/* Quick issues */}
      <div>
        <div style={sectionTitle}>Quick issues</div>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {QUICK_ISSUES.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q.query)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                borderRadius:8, border:'1px solid transparent', background:'transparent',
                cursor:'pointer', textAlign:'left', width:'100%', transition:'all 0.15s',
                fontFamily:'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background='#1a1e28'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:q.color, flexShrink:0 }} />
              <span style={{ fontSize:13, color:'#7b8099' }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}

const sectionTitle = {
  fontSize:10, fontWeight:600, letterSpacing:0.8, textTransform:'uppercase',
  color:'#4a5068', marginBottom:10
};
