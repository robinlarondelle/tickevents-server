const nodemailer = require('nodemailer');

module.exports = {
  sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'TicketStore: Verify your Email!',
      text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error)
      else console.log('Email sent: ' + info.response)
    });
  }
}