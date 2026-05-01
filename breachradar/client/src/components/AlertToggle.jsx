import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AlertToggle({ email }) {
  const [subscribed, setSubscribed] = useState(false);
  const API = import.meta.env.VITE_API_URL || '';

  // Optionally fetch existing subscription status (if you implement a GET endpoint per email)
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`${API}/api/subscription/${email}`);
        setSubscribed(data?.isActive ?? false);
      } catch (e) {
        // If endpoint doesn't exist, ignore – default is false
      }
    };
    if (email) fetchStatus();
  }, [email]);

  const handleSubscribe = async () => {
    try {
      await axios.post(`${API}/api/subscribe`, { email });
      setSubscribed(true);
    } catch (e) {
      console.error('Subscribe error', e);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.delete(`${API}/api/unsubscribe/${email}`);
      setSubscribed(false);
    } catch (e) {
      console.error('Unsubscribe error', e);
    }
  };

  return (
    <div className="mt-6 text-center">
      {subscribed ? (
        <button
          onClick={handleUnsubscribe}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition"
        >
          Unsubscribe from breach alerts
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 transition"
        >
          Subscribe to breach alerts
        </button>
      )}
    </div>
  );
}
