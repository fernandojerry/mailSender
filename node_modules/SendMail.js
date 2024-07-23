const express = require('express');
var cors = require('cors');
const { sendEmail } = require('./mail');
const app = express();
const helmet = require('helmet');

app.use(helmet({
  crossOriginEmbedderPolicy: process.env.NODE_ENV !== 'development'
}));

const whitelist = process.env.FRONTEND_APP_URLS.split(',');
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) { // Allow requests with no origin, such as Postman
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_, res) => {
  return res.send('Silence is golden');
});

app.post('/send-email', async (req, res) => {
  const { name, email, subject, amount, date, logoUrl } = req.body;

  // Basic validation
  if (!email || !email.trim() || !name || !name.trim() || !subject || !subject.trim() || !amount || !date) {
    return res.status(400).json({ message: 'name, email, subject, amount, and date are required' });
  }

  const recipients = `${name} <${email}>`;
  const message = `Your transaction of $${amount} on ${date} was successful.`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <img src="${logoUrl}" alt="Logo" style="max-width: 200px; margin-bottom: 20px;" />
      <h2>Transaction Successful</h2>
      <p>Amount: $${amount}</p>
      <p>Date: ${date}</p>
      <p>Your transaction was successful!</p>
    </div>
  `;

  try {
    const result = await sendEmail({ recipients, subject, message, htmlContent });
    res.json({ message: 'Email sent successfully', result });
  } catch (error) {
    console.error(`Unable to send email to ${JSON.stringify({ recipients })}: ${error}`);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = app;
