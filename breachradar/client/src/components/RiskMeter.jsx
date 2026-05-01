import React from 'react';

const RiskMeter = ({ score, severity }) => {
  const rotation = (score / 100) * 180 - 90;
  
  let color = '#00f2ff'; // Safe
  if (score >= 80) color = '#ff0000'; // Critical
  else if (score >= 60) color = '#ff8800'; // High
  else if (score >= 40) color = '#ffdd00'; // Medium

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            strokeLinecap="butt"
          />
          {/* Active Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 * (1 - score / 100)}
            strokeLinecap="butt"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        
        {/* Pointer */}
        <div 
          className="absolute bottom-0 w-1 h-32 bg-gradient-to-t from-white to-transparent origin-bottom transition-transform duration-1000 ease-out z-10"
          style={{ transform: `rotate(${rotation}deg)` }}
        ></div>

        {/* Score Display */}
        <div className="absolute bottom-0 text-center">
          <div className="text-4xl font-black text-white glow-text leading-none">{score}</div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">THREAT_INDEX</div>
        </div>
      </div>

      {/* Segments Indicator */}
      <div className="flex gap-1 w-full max-w-[200px]">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`h-1 flex-grow rounded-full transition-colors duration-500 ${i < score / 10 ? 'bg-cyan-500 glow-border' : 'bg-white/5'}`}
            style={{ backgroundColor: i < score / 10 ? color : '' }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RiskMeter;
