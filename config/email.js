const nodemailer = require('nodemailer');
require('dotenv').config();


async function sendEmail(to, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_GMAIL,
            pass: process.env.NODEMAILER_APPPASS
        }
    });

    const mailOptions = {
        from: process.env.NODEMAILER_GMAIL,
        to,
        subject,
        text: message
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
