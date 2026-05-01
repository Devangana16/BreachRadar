import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BreachTimeline = ({ breaches }) => {
  const processData = () => {
    const counts = {};
    breaches.forEach(b => {
      const year = b.breachDate.split('-')[0];
      counts[year] = (counts[year] || 0) + 1;
    });

    return Object.keys(counts)
      .sort()
      .map(year => ({ year, count: counts[year] }));
  };

  const data = processData();

  if (data.length === 0) return null;

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full">
      <h3 className="text-xl font-semibold mb-6 text-slate-300">Breach Timeline</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip
              cursor={{ fill: '#334155' }}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#fff' }}
            />
            <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BreachTimeline;
