import React from 'react';

const BreachCard = ({ breach }) => {
  const getBadgeColor = (dc) => {
    switch (dc.toLowerCase()) {
      case 'passwords': return 'text-red-500 border-red-500/30';
      case 'credit cards': return 'text-orange-500 border-orange-500/30';
      case 'phone numbers': return 'text-yellow-500 border-yellow-500/30';
      case 'email addresses': return 'text-blue-500 border-blue-500/30';
      default: return 'text-slate-500 border-white/10';
    }
  };

  const formatPwnCount = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="glass-panel p-5 rounded-lg border-l-2 border-l-cyan-500 relative group overflow-hidden transition-all hover:bg-white/5">
      <div className="absolute top-0 right-0 p-2 opacity-5 font-mono text-[40px] font-black group-hover:opacity-10 transition-opacity pointer-events-none">
        #0{Math.floor(Math.random()*10)}
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight">{breach.name}</h4>
          <div className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest">{breach.domain}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Impact</div>
          <div className="text-sm font-mono text-red-400">{formatPwnCount(breach.pwnCount)}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {breach.dataClasses.map((dc, i) => (
          <span
            key={i}
            className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-tighter ${getBadgeColor(dc)}`}
          >
            {dc}
          </span>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
        <span className="text-[9px] font-mono text-slate-600 uppercase">Recorded: {breach.breachDate}</span>
        <button className="text-[9px] font-mono text-cyan-500/50 hover:text-cyan-400 transition-colors uppercase">[ DETAILS ]</button>
      </div>
    </div>
  );
};

export default BreachCard;
