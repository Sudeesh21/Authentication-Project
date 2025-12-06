// File: backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER, // Keep this as the Brevo Login (9d17...)
        pass: process.env.EMAIL_PASS  // Keep this as the Brevo Key
      }
    });

    const info = await transporter.sendMail({
      // --- CHANGE THIS LINE ---
      // Do NOT use process.env.EMAIL_USER here. 
      // Use your ACTUAL Gmail address that you used to sign up for Brevo.
      from: `"Creativo App" <sudeeshcoder@gmail.com>`, 
      to: to,
      subject: subject,
      text: text,
    });

    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendEmail;
