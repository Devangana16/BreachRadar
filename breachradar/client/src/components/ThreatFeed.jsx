import React, { useState, useEffect } from 'react';

const cities = ['London', 'New York', 'Tokyo', 'Berlin', 'Moscow', 'Paris', 'Beijing', 'Sydney', 'Mumbai', 'Sao Paulo'];
const breaches = ['SQL Injection', 'XSS Attack', 'Credential Stuffing', 'DDoS', 'Data Exfiltration', 'Brute Force'];

const ThreatFeed = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        city: cities[Math.floor(Math.random() * cities.length)],
        type: breaches[Math.floor(Math.random() * breaches.length)],
        timestamp: new Date().toLocaleTimeString(),
        ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.x.x`
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-64 space-y-2 pointer-events-none hidden lg:block">
      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Global_Threat_Feed</div>
      {events.map(event => (
        <div key={event.id} className="glass-panel p-2 rounded border-l-2 border-l-red-500 animate-in slide-in-from-right duration-500">
          <div className="flex justify-between text-[8px] font-mono text-red-400">
            <span>[ {event.type} ]</span>
            <span>{event.timestamp}</span>
          </div>
          <div className="text-[10px] font-mono text-white mt-1">
            Origin: <span className="text-slate-400">{event.city}</span> ({event.ip})
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreatFeed;
