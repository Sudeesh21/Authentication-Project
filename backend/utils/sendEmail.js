const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com", // Brevo Server
      port: 587,                    // Brevo Port
      secure: false,                
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Authentication App" <${process.env.EMAIL_USER}>`, 
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
