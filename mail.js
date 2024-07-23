const nodemailer = require('nodemailer');

const mailTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates if necessary
  }
});

const sendEmail = async ({ recipients, subject, message, htmlContent }) => {
  const result = await mailTransport.sendMail({
    from: process.env.MAIL_SENDER_DEFAULT, // sender address
    to: recipients, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: htmlContent, // html body
  });
  console.log(`Email sent: `, result);
  return result;
}

module.exports = { sendEmail };
