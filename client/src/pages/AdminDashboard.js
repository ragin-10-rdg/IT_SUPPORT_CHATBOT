import React, { useEffect, useState } from 'react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}
function formatTime(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleTimeString(); } catch { return d; }
}

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState(() => sessionStorage.getItem('it_support_admin_user') || '');
  const [password, setPassword] = useState(() => sessionStorage.getItem('it_support_admin_pw') || '');
  const [authenticated, setAuthenticated] = useState(() => !!(sessionStorage.getItem('it_support_admin_pw') && sessionStorage.getItem('it_support_admin_user')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [escalations, setEscalations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { if (authenticated) loadEscalations(); }, [authenticated]);

  const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'x-admin-password': password, 'x-admin-username': adminUser });

  async function loadEscalations() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/escalations`, { headers: getAuthHeaders() });
      if (!res.ok) { if (res.status === 401) throw new Error('Unauthorized.'); throw new Error('Unable to load escalations.'); }
      const data = await res.json();
      setEscalations(data.escalations || []);
    } catch (err) {
      setError(err.message); setEscalations([]); setAuthenticated(false); sessionStorage.removeItem('it_support_admin_pw');
    } finally { setLoading(false); }
  }

  const handleLogin = async () => {
    if (!adminUser.trim() || !password.trim()) { setError('Please enter both username and password.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/escalations`, { headers: getAuthHeaders() });
      if (!res.ok) { if (res.status === 401) throw new Error('Unauthorized'); throw new Error('Unable to authenticate'); }
      const data = await res.json();
      sessionStorage.setItem('it_support_admin_pw', password);
      sessionStorage.setItem('it_support_admin_user', adminUser);
      setAuthenticated(true);
      setEscalations(data.escalations || []);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleResolve = async (sessionId) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/escalations/${sessionId}/resolve`, { method:'POST', headers: getAuthHeaders() });
      if (!res.ok) { if (res.status === 401) throw new Error('Unauthorized'); throw new Error('Unable to resolve escalation'); }
      await loadEscalations(); setSelected(null);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const handleLogout = () => { sessionStorage.removeItem('it_support_admin_pw'); sessionStorage.removeItem('it_support_admin_user'); setAuthenticated(false); setEscalations([]); setPassword(''); setAdminUser(''); setError('Logged out.'); };
  

  if (!authenticated) {
    return (
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div style={{ width:'100%', maxWidth:500, background:'#13161d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:28 }}>
          <h2 style={{ color:'#e8eaf0', marginBottom:12 }}>Admin Escalation Login</h2>
          <p style={{ color:'#7b8099', marginBottom:20 }}>Enter the admin password to view and manage escalated IT issues.</p>
          <input type="text" value={adminUser} onChange={(e)=>setAdminUser(e.target.value)} placeholder="Admin username"
            style={{ width:'100%', padding:'12px 14px', marginBottom:10, borderRadius:10, border:'1px solid rgba(255,255,255,0.06)', background:'#0d1118', color:'#e8eaf0' }} />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Admin password"
            style={{ width:'100%', padding:'12px 14px', marginBottom:14, borderRadius:10, border:'1px solid rgba(255,255,255,0.06)', background:'#0d1118', color:'#e8eaf0' }} />
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={handleLogin} disabled={loading} style={{ flex:1, padding:12, borderRadius:10, border:'none', background:'#4f8ef7', color:'#fff', fontWeight:700 }}>{loading ? 'Checking...' : 'Unlock Dashboard'}</button>
            <button onClick={()=>{ setPassword(''); setAdminUser(''); setError(''); }} style={{ padding:12, borderRadius:10, background:'transparent', border:'1px solid rgba(255,255,255,0.06)', color:'#e8eaf0' }}>Clear</button>
          </div>
          {error && <p style={{ color:'#f25c5c', marginTop:12 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, padding:24, overflowY:'auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <div style={{ color:'#e8eaf0', fontSize:22, fontWeight:700 }}>Escalation Dashboard</div>
          <div style={{ color:'#7b8099', marginTop:6 }}>{escalations.length} escalated sessions awaiting review.</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={handleLogout} style={{ border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 12px', background:'transparent', color:'#e8eaf0' }}>Logout</button>
          <button onClick={loadEscalations} disabled={loading} style={{ border:'none', borderRadius:10, padding:'8px 12px', background:'#4f8ef7', color:'#fff' }}>{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>

      {error && <div style={{ padding:12, marginBottom:14, borderRadius:8, background:'rgba(242,92,92,0.06)', color:'#f25c5c' }}>{error}</div>}

      <div style={{ background:'#0f1114', border:'1px solid rgba(255,255,255,0.04)', borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ textAlign:'left' }}>
              <th style={{ padding:'12px 16px', color:'#7b8099', fontSize:13 }}>Date</th>
              <th style={{ padding:'12px 16px', color:'#7b8099', fontSize:13 }}>Time</th>
              <th style={{ padding:'12px 16px', color:'#7b8099', fontSize:13 }}>User</th>
              <th style={{ padding:'12px 16px', color:'#7b8099', fontSize:13 }}>Problem</th>
              <th style={{ padding:'12px 16px', color:'#7b8099', fontSize:13 }}>Category</th>
              <th style={{ padding:'12px 16px', color:'#7b8099', fontSize:13, width:120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {escalations.map((it) => {
              const firstUser = (it.messages || []).find(m => m.role === 'user') || { content: '' };
              const problem = (it.lastUserQuery && it.lastUserQuery.length > 60) ? it.lastUserQuery.slice(0,60)+'...' : (it.lastUserQuery || firstUser.content || '—');
              const userName = it.userAgent || (firstUser.content ? firstUser.content.split('\n')[0] : it.sessionId);
              return (
                <tr key={it.sessionId} style={{ borderTop:'1px solid rgba(255,255,255,0.03)', cursor:'pointer' }} onClick={() => setSelected(it)}>
                  <td style={{ padding:'12px 16px', color:'#e8eaf0' }}>{formatDate(it.escalatedAt || it.createdAt)}</td>
                  <td style={{ padding:'12px 16px', color:'#e8eaf0' }}>{formatTime(it.escalatedAt || it.createdAt)}</td>
                  <td style={{ padding:'12px 16px', color:'#e8eaf0' }}>{userName}</td>
                  <td style={{ padding:'12px 16px', color:'#e8eaf0' }}>{problem}</td>
                  <td style={{ padding:'12px 16px', color:'#e8eaf0' }}>{it.lastMatchedEntry?.category || 'General'}</td>
                  <td style={{ padding:'12px 16px', color:'#e8eaf0' }}>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={(e)=>{ e.stopPropagation(); setSelected(it); }} style={{ borderRadius:8, padding:'6px 10px', background:'#22252a', color:'#e8eaf0', border:'1px solid rgba(255,255,255,0.04)' }}>Details</button>
                      <button onClick={async (e)=>{ e.stopPropagation(); if(confirm('Resolve this escalation?')) await handleResolve(it.sessionId); }} style={{ borderRadius:8, padding:'6px 10px', background:'#34d48a', color:'#08120e', border:'none' }}>Resolve</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={{ position:'fixed', left:0, top:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.5)' }} onClick={() => setSelected(null)}>
          <div onClick={(e)=>e.stopPropagation()} style={{ width:'min(900px,96%)', maxHeight:'86vh', overflowY:'auto', background:'#0f1317', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
              <div>
                <div style={{ color:'#e8eaf0', fontSize:18, fontWeight:700 }}>Session {selected.sessionId}</div>
                <div style={{ color:'#7b8099', marginTop:6 }}>{selected.lastUserQuery || 'No query'}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setSelected(null)} style={{ border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'#e8eaf0', padding:'8px 12px', borderRadius:8 }}>Close</button>
                <button onClick={async ()=>{ if(confirm('Resolve this escalation?')) { await handleResolve(selected.sessionId); } }} style={{ background:'#34d48a', border:'none', color:'#08120e', padding:'8px 12px', borderRadius:8 }}>Resolve</button>
              </div>
            </div>

            <div style={{ marginTop:14, display:'grid', gap:10 }}>
              <div style={{ color:'#7b8099' }}><strong style={{ color:'#e8eaf0' }}>Category:</strong> {selected.lastMatchedEntry?.category || 'General'}</div>
              <div style={{ color:'#7b8099' }}><strong style={{ color:'#e8eaf0' }}>Created:</strong> {new Date(selected.createdAt).toLocaleString()}</div>
              <div style={{ color:'#7b8099' }}><strong style={{ color:'#e8eaf0' }}>Escalated:</strong> {selected.escalatedAt ? new Date(selected.escalatedAt).toLocaleString() : 'Pending'}</div>
            </div>

            <div style={{ marginTop:18, display:'grid', gap:12 }}>
              {(selected.messages || []).map((m, i) => (
                <div key={i} style={{ padding:12, borderRadius:8, background: m.source === 'user' ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.03)', color:'#e8eaf0' }}>
                  <div style={{ fontSize:12, color:'#7b8099', marginBottom:6 }}>{m.source === 'user' ? 'User' : m.source === 'database' ? 'KB' : m.source === 'claude_ai' ? 'AI' : m.source === 'escalation' ? 'Escalation' : 'System'}</div>
                  <div style={{ whiteSpace:'pre-wrap', lineHeight:1.6 }}>{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
