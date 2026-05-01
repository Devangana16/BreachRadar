const axios = require('axios');
const { execSync } = require('child_process');
const AlertSubscription = require('../models/AlertSubscription');
const ScanHistory = require('../models/ScanHistory');
const { sendBreachAlert } = require('./mailer');

const checkAndAlert = async () => {
  try {
    const subscriptions = await AlertSubscription.find({ isActive: true });
    
    for (const sub of subscriptions) {
      const email = sub.email;
      let apiResponse;
      try {
        apiResponse = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`, {
          headers: {
            'hibp-api-key': process.env.HIBP_API_KEY,
            'user-agent': 'BreachRadar'
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // No breaches found
          continue;
        }
        console.error(`Error checking HIBP API for ${email}:`, error.message);
        continue;
      }

      const currentBreaches = apiResponse.data || [];
      
      if (currentBreaches.length > 0) {
        const lastScan = await ScanHistory.findOne({ email }).sort({ scanDate: -1 });
        const lastBreachNames = lastScan ? lastScan.breaches.map(b => b.name) : [];
        
        const newBreaches = currentBreaches.filter(b => !lastBreachNames.includes(b.Name));
        
        for (const breach of newBreaches) {
          await sendBreachAlert(email, breach.Name, breach.DataClasses);
        }

        if (newBreaches.length > 0) {
          sub.lastNotified = Date.now();
          await sub.save();
          
          // Optional: we might want to run the python script to rescore, but let's just save a new history entry or just let the user re-scan.
        }
      }
    }
  } catch (err) {
    console.error('Error in checkAndAlert:', err);
  }
};

module.exports = { checkAndAlert };
