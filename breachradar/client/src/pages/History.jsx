import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const SEVERITY_COLORS = {
  Critical: '#FF4444', High: '#FF8C00', Medium: '#FFD700', Low: '#00C8FF', Safe: '#00FF88',
};

export default function History() {
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchHistory = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API}/api/history/${encodeURIComponent(email.trim())}`);
      setHistory(data);
    } catch (err) {
      setError('Could not fetch history. Make sure the server is running.');
      setHistory([]);
    }
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen px-4 py-10 md:py-16" style={{ zIndex: 1, maxWidth: 860, margin: '0 auto' }}>

      {/* Back */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <BackIcon /> Back to Scanner
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#fff' }}>Scan History</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Look up past scan results for any email address.</p>
      </div>

      {/* Search form */}
      <div className="card p-5 rounded-xl mb-8">
        <form onSubmit={fetchHistory} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email to look up history..."
            required
            className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,255,136,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
            style={{ background: 'var(--green)', color: '#0D0D0D', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}
          >
            <SearchIcon /> {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm mb-4" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', color: '#FF6B6B' }}>
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        history.length === 0 ? (
          <div className="card p-10 rounded-xl text-center" style={{ border: '1px solid var(--border)' }}>
            <div className="text-3xl mb-3">📭</div>
            <p className="font-medium mb-1" style={{ color: '#fff' }}>No history found</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No scans have been run for this email yet.</p>
          </div>
        ) : (
          <div className="card rounded-xl overflow-hidden">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="terminal text-xs" style={{ background: 'var(--surface2)', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                  {['DATE', 'RISK SCORE', 'BREACHES', 'SEVERITY'].map(h => (
                    <th key={h} className="text-left px-5 py-3" style={{ fontWeight: 600, borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((scan, i) => {
                  const sevColor = SEVERITY_COLORS[scan.severity] || '#00FF88';
                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-4" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                        {new Date(scan.scanDate).toLocaleDateString()} {new Date(scan.scanDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold" style={{ color: sevColor, fontFamily: 'JetBrains Mono, monospace', fontSize: 15 }}>{scan.riskScore ?? '—'}</span>
                          <div className="w-20 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--surface2)' }}>
                            {scan.riskScore != null && (
                              <div className="h-full rounded-full" style={{ width: `${scan.riskScore}%`, background: sevColor }}></div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4" style={{ color: 'var(--text)' }}>{scan.breachCount ?? '—'}</td>
                      <td className="px-5 py-4">
                          <span className={`terminal text-xs px-2.5 py-1 rounded badge-${(scan.severity || 'safe').toLowerCase()}`}>
                            {scan.severity || 'Safe'}
                          </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
