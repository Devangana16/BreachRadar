const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBreachAlert = async (email, breachName, dataClasses) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `⚠️ New Breach Detected — Your Email Was Found in ${breachName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="color: #22d3ee;">BreachRadar Alert 🔐</h1>
        <p style="font-size: 16px;">Your email <strong>${email}</strong> was found in the <strong>${breachName}</strong> data breach.</p>
        <div style="background-color: #1e293b; padding: 15px; margin: 20px auto; border-radius: 8px; max-width: 400px; text-align: left;">
          <h3 style="color: #94a3b8; margin-top: 0;">Data Exposed:</h3>
          <ul style="color: #cbd5e1;">
            ${dataClasses.map(dc => `<li>${dc}</li>`).join('')}
          </ul>
        </div>
        <div style="background-color: #ef4444; color: white; padding: 15px; margin: 20px auto; border-radius: 8px; max-width: 400px; font-weight: bold;">
          Change your password for this service immediately.
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 30px;">
          <a href="${process.env.VITE_API_URL || 'http://localhost:5000'}/api/unsubscribe/${email}" style="color: #22d3ee; text-decoration: none;">Unsubscribe from these alerts</a>
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${email} for breach ${breachName}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
  }
};

module.exports = { sendBreachAlert };
