import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Scanner', path: '/' },
    { name: 'History', path: '/history' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-16 border-b border-white/5 bg-slate-950/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-110">
            <Shield className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Breach<span className="text-cyan-400">Radar</span></span>
        </Link>
        
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-all hover:text-cyan-400 ${
                location.pathname === item.path ? 'text-cyan-400 glow-text' : 'text-slate-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
