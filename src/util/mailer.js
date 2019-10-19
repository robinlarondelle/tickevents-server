const nodemailer = require('nodemailer');

module.exports = {
  sendVerificationEmail(userEmail, verificationToken, identityUserID) {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })

    const link = `${process.env.CLIENT_URL}/verify-email/${identityUserID}/${verificationToken}`
    const resendEmailLink = `${process.env.CLIENT_URL}/resend-verification-email`
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'TickEvents: Bevestig je email!',
      text: 
      
      `
      Hey jij!
      
      Klik op de volgende link om je email te bevestigen: 
      
      ${link}

      Hou er rekening mee dat deze link zal verlopen na 1 uur. Link verlopen? Verzend bevestigingsmail nog een keer:
      
      ${resendEmailLink}


      Met vriendelijke groet,
      Robin La Rondelle
      Owner of TickEvents
      `
      }

    transporter.sendMail(mailOptions, (error, info) => {
      //TODO: Log info to logging table
      if (error) console.log(error)
    })
  }
}