import React from 'react';

const Radar = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 border border-cyan-500/30 rounded-full flex items-center justify-center overflow-hidden">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[1px] bg-cyan-500/10"></div>
        <div className="h-full w-[1px] bg-cyan-500/10 absolute"></div>
        <div className="w-3/4 h-3/4 border border-cyan-500/10 rounded-full absolute"></div>
        <div className="w-1/2 h-1/2 border border-cyan-500/10 rounded-full absolute"></div>
        <div className="w-1/4 h-1/4 border border-cyan-500/10 rounded-full absolute"></div>
      </div>
      
      {/* Scanning Arm */}
      <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}></div>
      
      {/* Center Icon */}
      <div className="relative z-10 w-4 h-4 bg-cyan-500 rounded-full glow-border"></div>
      
      {/* Random Dots (Blips) */}
      <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
    </div>
  );
};

export default Radar;
