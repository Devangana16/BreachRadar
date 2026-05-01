import React, { useState } from 'react';
import axios from 'axios';

const AlertSubscribe = ({ email }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSubscribe = async () => {
    setLoading(true);
    try {
      if (subscribed) {
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/unsubscribe/${email}`);
        setSubscribed(false);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/subscribe`, { email });
        setSubscribed(true);
      }
    } catch (error) {
      console.error('Subscription error', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between w-full">
      <div className="mb-4 sm:mb-0 text-center sm:text-left">
        <h4 className="text-lg font-bold text-white mb-1">Get Notified</h4>
        <p className="text-sm text-slate-400">Get notified if this email appears in future breaches</p>
      </div>
      
      <button 
        onClick={toggleSubscribe} 
        disabled={loading}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${subscribed ? 'bg-cyan-500' : 'bg-slate-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${subscribed ? 'translate-x-7' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

export default AlertSubscribe;
