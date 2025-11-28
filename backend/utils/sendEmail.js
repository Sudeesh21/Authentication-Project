// File: backend/utils/sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services
      auth: {
        user: process.env.EMAIL_USER, // From .env file
        pass: process.env.EMAIL_PASS  // From .env file
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;