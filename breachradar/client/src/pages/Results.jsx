import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertToggle from '../components/AlertToggle';

const API = import.meta.env.VITE_API_URL || '';

// --- Icons ---
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ShieldOkIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);

// --- Severity config ---
const SEVERITY = {
  Critical: { color: '#FF4444', bg: 'rgba(255,68,68,0.08)',   border: 'rgba(255,68,68,0.2)',   badge: 'badge-critical', label: 'Critical Risk' },
  High:     { color: '#FF8C00', bg: 'rgba(255,140,0,0.08)',   border: 'rgba(255,140,0,0.2)',   badge: 'badge-high',     label: 'High Risk' },
  Medium:   { color: '#FFD700', bg: 'rgba(255,215,0,0.08)',   border: 'rgba(255,215,0,0.2)',   badge: 'badge-medium',   label: 'Medium Risk' },
  Low:      { color: '#00C8FF', bg: 'rgba(0,200,255,0.08)',   border: 'rgba(0,200,255,0.2)',   badge: 'badge-low',      label: 'Low Risk' },
  Safe:     { color: '#00FF88', bg: 'rgba(0,255,136,0.08)',   border: 'rgba(0,255,136,0.2)',   badge: 'badge-safe',     label: 'No Breaches Found' },
};

// --- Risk bar ---
function RiskBar({ score }) {
  const color = score > 70 ? '#FF4444' : score > 40 ? '#FF8C00' : score > 15 ? '#FFD700' : '#00FF88';
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: 'var(--surface2)' }}>
      <div
        className="h-full rounded-full fill-bar"
        style={{ width: `${score}%`, background: color, transition: 'width 1s ease-out' }}
      />
    </div>
  );
}

// Password risk label config
const PASS_RISK = {
  plaintext:    { label: 'Plain text — very easy to crack', color: '#FF4444' },
  easytocrack:  { label: 'Weak hash — easy to crack',       color: '#FF8C00' },
  hardtocrack:  { label: 'Strong hash — hard to crack',     color: '#FFD700' },
  unknown:      { label: 'Password risk unknown',            color: '#555' },
};

// --- Breach card ---
function BreachCard({ breach }) {
  const isRecent = parseInt(breach.breachDate, 10) >= new Date().getFullYear() - 2;
  const sensitiveTypes = ['Passwords', 'Credit card details', 'Partial credit card data', 'Social security numbers', 'Government IDs', 'Bank account numbers'];
  const hasSensitive = breach.dataClasses.some(d => sensitiveTypes.includes(d));
  const passRisk = PASS_RISK[breach.passwordRisk] || PASS_RISK.unknown;

  return (
    <div className="card p-5 rounded-xl transition-all" style={{ borderColor: isRecent ? 'rgba(255,68,68,0.25)' : hasSensitive ? 'rgba(255,140,0,0.2)' : 'var(--border)' }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {breach.logoPath ? (
            <img src={breach.logoPath} alt={breach.name} className="w-8 h-8 rounded object-contain" style={{ background: '#222', padding: 2 }} onError={e => e.target.style.display='none'} />
          ) : (
            <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ background: 'var(--surface2)', color: 'var(--green)' }}>
              {breach.name?.[0] || '?'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm" style={{ color: '#fff' }}>{breach.name}</h3>
              {breach.verified && <span className="terminal text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,255,136,0.08)', color: 'var(--green)', border: '1px solid rgba(0,255,136,0.15)' }}>✓ Verified</span>}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{breach.domain || '—'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-xs font-medium terminal" style={{ color: 'var(--muted)' }}>{breach.breachDate}</span>
          {isRecent && (
            <span className="terminal text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(255,68,68,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,68,68,0.2)' }}>
              Recent
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {breach.description && (
        <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--muted)', borderLeft: '2px solid rgba(255,255,255,0.05)', paddingLeft: 10 }}>
          {breach.description.length > 220 ? breach.description.slice(0, 220) + '…' : breach.description}
        </p>
      )}

      <div className="mb-3">
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Exposed data:</p>
        <div className="flex flex-wrap gap-1.5">
          {breach.dataClasses.map((dc, i) => {
            const isSensitive = sensitiveTypes.includes(dc);
            return (
              <span key={i} className="terminal text-[10px] px-2 py-0.5 rounded" style={{
                background: isSensitive ? 'rgba(255,68,68,0.08)' : 'var(--surface2)',
                color: isSensitive ? '#FF6B6B' : 'var(--text)',
                border: `1px solid ${isSensitive ? 'rgba(255,68,68,0.2)' : 'var(--border)'}`,
              }}>{dc}</span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {(breach.pwnCount || 0).toLocaleString()} accounts
        </span>
        {breach.passwordRisk && breach.passwordRisk !== 'unknown' && (
          <span className="terminal text-[10px]" style={{ color: passRisk.color }}>{passRisk.label}</span>
        )}
      </div>
    </div>
  );
}

// --- Main Results page ---
export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ zIndex: 1, position: 'relative' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--muted)' }}>No scan result found.</p>
          <button onClick={() => navigate('/')} className="text-sm" style={{ color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  const { email, riskScore, severity, breachCount, breaches } = result;
  const sev = SEVERITY[severity] || SEVERITY.Safe;

  return (
    <div className="relative min-h-screen px-4 py-10 md:py-16" style={{ zIndex: 1, maxWidth: 860, margin: '0 auto' }}>

      {/* Back button + header */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <BackIcon /> Back
        </button>
        <span style={{ color: 'var(--border)', userSelect: 'none' }}>/</span>
        <span className="terminal text-xs" style={{ color: 'var(--muted)' }}>{email}</span>
      </div>

      <>
        {/* ── Summary panel ── */}
        <div className="card p-7 mb-6 rounded-2xl" style={{ border: `1px solid ${sev.border}`, background: sev.bg }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Icon + verdict */}
            <div className="flex items-center gap-4">
              <div style={{ color: sev.color }}>
                {riskScore === 0 ? <ShieldOkIcon /> : <AlertIcon />}
              </div>
              <div>
                <div className={`terminal text-xs px-2 py-0.5 rounded inline-block mb-1 ${sev.badge}`}>
                  {sev.label}
                </div>
                <h1 className="text-2xl font-bold" style={{ color: '#fff' }}>
                  {riskScore === 0
                    ? 'No breaches found'
                    : `${breachCount} breach${breachCount !== 1 ? 'es' : ''} found`}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  Scanned: <span style={{ color: 'var(--text)' }}>{email}</span>
                </p>
              </div>
            </div>

            {/* Risk score */}
            <div className="md:ml-auto text-center md:text-right">
              <div className="text-5xl font-bold mb-1" style={{ color: sev.color, fontFamily: 'JetBrains Mono, monospace' }}>
                {riskScore}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Risk Score / 100</div>
              <div className="mt-2 w-32 md:ml-auto">
                <RiskBar score={riskScore} />
              </div>
            </div>
          </div>

          {/* What this means */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
              {riskScore === 0 && 'Great news — your email was not found in any known data breaches. Keep using strong, unique passwords and enable two-factor authentication.'}
              {riskScore > 0 && riskScore <= 15 && 'Your email appears in one or more older breaches with low-sensitivity data. Monitor your accounts and update passwords where possible.'}
              {riskScore > 15 && riskScore <= 40 && 'Your email is in breaches that exposed moderately sensitive data. Update your passwords immediately, especially on affected services.'}
              {riskScore > 40 && riskScore <= 70 && 'Your email is in high-risk breaches. Change passwords on all affected accounts now and enable two-factor authentication everywhere.'}
              {riskScore > 70 && 'Critical: your email was found in severe breaches exposing passwords or financial data. Act immediately — change all passwords and check for unauthorized access.'}
            </p>
          </div>
        </div>

        {/* ── Action steps ── */}
        {riskScore > 0 && (() => {
          // Determine what data was exposed to customize recommendations
          const hasPasswords = breaches.some(b => b.dataClasses.some(dc => dc.toLowerCase().includes('password')));
          const hasFinancial = breaches.some(b => b.dataClasses.some(dc => dc.toLowerCase().includes('credit') || dc.toLowerCase().includes('bank')));
          const hasPII = breaches.some(b => b.dataClasses.some(dc => dc.toLowerCase().includes('social security') || dc.toLowerCase().includes('id') || dc.toLowerCase().includes('address') || dc.toLowerCase().includes('birth')));
          const hasPhone = breaches.some(b => b.dataClasses.some(dc => dc.toLowerCase().includes('phone')));

          const steps = [];

          if (hasPasswords) {
            steps.push({ num: '1', title: 'Change Passwords', desc: 'Update passwords on every breached site listed below immediately.' });
            steps.push({ num: '2', title: 'Stop Reusing Passwords', desc: 'If you reused any breached password elsewhere, change it there too. Use a password manager.' });
          } else {
            steps.push({ num: '1', title: 'Review Account Security', desc: 'Even without passwords exposed, review your security settings on affected sites.' });
          }

          if (hasFinancial) {
            steps.push({ num: steps.length + 1, title: 'Monitor Financials', desc: 'Financial data was exposed. Closely monitor your bank and credit card statements for fraud.' });
          } else if (hasPII) {
            steps.push({ num: steps.length + 1, title: 'Watch for Identity Theft', desc: 'Personal info was exposed. Be alert for phishing emails and identity theft attempts.' });
          } else if (hasPhone) {
            steps.push({ num: steps.length + 1, title: 'Beware of SMS Scams', desc: 'Your phone number was leaked. Be highly suspicious of unexpected texts or calls.' });
          } else {
             steps.push({ num: steps.length + 1, title: 'Enable 2FA', desc: 'Add two-factor authentication to your accounts to prevent future unauthorized access.' });
          }
          
          // Fill up to 3 steps
          if (steps.length < 3) {
            if (!steps.find(s => s.title === 'Enable 2FA')) {
               steps.push({ num: steps.length + 1, title: 'Enable 2FA', desc: 'Add two-factor authentication to your important accounts.' });
            } else {
               steps.push({ num: steps.length + 1, title: 'Stay Vigilant', desc: 'Cyber criminals often use leaked data for targeted phishing attacks.' });
            }
          }

          return (
            <div className="card p-5 mb-6 rounded-xl">
              <h2 className="font-semibold text-sm mb-4" style={{ color: '#fff' }}>
                ⚡ Customized Action Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {steps.slice(0, 3).map(s => (
                  <div key={s.num} className="rounded-lg p-4" style={{ background: 'var(--surface2)' }}>
                    <div className="terminal text-xs mb-2" style={{ color: 'var(--green)' }}>STEP {s.num}</div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#fff' }}>{s.title}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── Breach list ── */}
        {breaches && breaches.length > 0 && (
          <div>
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: '#fff' }}>
              Breach Details
              <span className="terminal text-xs px-2 py-0.5 rounded badge-critical">{breaches.length} found</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {breaches.map((b, i) => <BreachCard key={i} breach={b} />)}
            </div>
          </div>
        )}
      </>

      {/* Alert Subscription Toggle */}
      <AlertToggle email={email} />

      {/* Footer nav */}
      <div className="flex items-center gap-4 mt-10 text-sm" style={{ color: 'var(--muted)' }}>
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1.5 transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <HistoryIcon /> View scan history
        </button>
      </div>
    </div>
  );
}
