import React from 'react';
import { ShieldAlert } from 'lucide-react';

const ScanOverlay = () => {
  return (
    <div className="fixed inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-[ping_2s_infinite]" style={{ animationDelay: '0s' }}></div>
        <div className="absolute inset-4 border-2 border-cyan-400 rounded-full animate-[ping_2s_infinite]" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute inset-8 border-2 border-cyan-400 rounded-full animate-[ping_2s_infinite]" style={{ animationDelay: '1s' }}></div>
        <ShieldAlert className="w-16 h-16 text-cyan-400 animate-pulse z-10" />
      </div>
      <h2 className="text-2xl font-semibold text-white tracking-wide">Scanning breach databases...</h2>
    </div>
  );
};

export default ScanOverlay;
