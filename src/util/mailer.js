const nodemailer = require('nodemailer');

module.exports = {
  sendVerificationEmail(email, verificationToken, JWTToken, IdentityID) {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const link = `http://localhost:3000/api/verify-email/?identityid=${IdentityID}&verificationtoken=${verificationToken}&jwt=${JWTToken}`
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'TicketStore: Verify your Email!',
      text: `Please click this link: \n\n${link}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error)
    });
  }
}