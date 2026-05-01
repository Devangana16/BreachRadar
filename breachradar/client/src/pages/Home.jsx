import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// Shield SVG icon
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const steps = [
  { label: 'Validating email format' },
  { label: 'Querying breach databases' },
  { label: 'Calculating risk score' },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setScanning(true);

    // Animate steps
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      const { data } = await axios.post(`${API}/api/scan`, { email: email.trim() });
      navigate('/results', { state: { result: data } });
    } catch (err) {
      setScanning(false);
      setStep(-1);
      setError(err.response?.data?.error || 'Server is unavailable. Make sure the backend is running.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ zIndex: 1 }}>

      {/* Logo / Brand */}
      <div className="flex items-center gap-3 mb-16">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--green-dim)', border: '1px solid rgba(0,255,136,0.2)', color: 'var(--green)' }}>
          <ShieldIcon />
        </div>
        <span className="text-lg font-semibold tracking-tight">BreachRadar</span>
        <span className="terminal px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(0,255,136,0.08)', color: 'var(--green)', border: '1px solid rgba(0,255,136,0.15)' }}>v2</span>
      </div>

      {/* Hero */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: '#fff', lineHeight: 1.15 }}>
          Is your email in a<br />
          <span style={{ color: 'var(--green)' }}>data breach?</span>
        </h1>
        <p className="text-base" style={{ color: 'var(--muted)' }}>
          Enter your email below. We'll check it against known breach databases and give you an accurate, detailed security report.
        </p>
      </div>

      {/* Scanner Card */}
      <div className="w-full max-w-lg">
        <div className="card p-6" style={{ boxShadow: '0 0 0 1px rgba(0,255,136,0.05), 0 20px 60px -10px rgba(0,0,0,0.5)' }}>
          {!scanning ? (
            <form onSubmit={handleScan}>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2 terminal" style={{ color: 'var(--muted)', letterSpacing: '0.08em' }}>
                  TARGET EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(0,255,136,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,68,68,0.2)', color: '#FF6B6B' }}>
                  ⚠ {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{ background: 'var(--green)', color: '#0D0D0D' }}
                onMouseEnter={e => e.target.style.opacity = '0.9'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                <SearchIcon /> Run Breach Scan
              </button>
            </form>
          ) : (
            /* Scanning animation */
            <div className="py-6">
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full spinner" style={{ border: '2px solid rgba(0,255,136,0.1)', borderTopColor: 'var(--green)' }}></div>
                  <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{ color: 'var(--green)' }}>
                    <ShieldIcon />
                  </div>
                </div>
              </div>
              <div className="terminal text-xs space-y-3" style={{ color: 'var(--muted)' }}>
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      {i < step ? (
                        <span style={{ color: 'var(--green)' }}>✓</span>
                      ) : i === step ? (
                        <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--green)' }}></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--border)' }}></div>
                      )}
                    </div>
                    <span style={{ color: i <= step ? 'var(--text)' : 'var(--muted)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>Scanning: {email}</p>
            </div>
          )}
        </div>

        {/* Help text */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--muted)' }}>
          Your email is never stored without your consent. Results are powered by{' '}
          <a href="https://haveibeenpwned.com" target="_blank" rel="noreferrer" style={{ color: 'var(--green)', textDecoration: 'none' }}>HaveIBeenPwned</a>.
        </p>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-6 mt-12 text-sm" style={{ color: 'var(--muted)' }}>
        <button onClick={() => navigate('/history')} className="hover:text-white transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}>
          View Scan History
        </button>
      </div>
    </div>
  );
}
