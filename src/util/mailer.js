const nodemailer = require('nodemailer');

module.exports = {
  sendVerificationEmail(userEmail, identityUserID, verificationToken, callback) {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })

    const link = `${process.env.CLIENT_URL}/home/verify-email/${identityUserID}/${verificationToken}`
    const resendEmailLink = `${process.env.CLIENT_URL}/home/resend-verification-email`
    
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
      if (error) callback(error, false)
      else callback(null, true)
    })
  },


  sendForgotPasswordMail(userEmail, identityUserID, token, callback) {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    })

    const link = `${process.env.CLIENT_URL}/home/forgot-password/${identityUserID}/${token}`

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'TickEvents: Bevestig je email!',
      text: 
      
      `
      Hey jij!
      
      Wacthwoord vergeten? Geen probleem. Klik op de onderstaande link om een nieuw wachtwoord aan te maken. Thats it :)

      ${link}

      Succes!


      Met vriendelijke groet,
      Robin La Rondelle
      Owner of TickEvents
      `
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) callback(error, false)
        else callback(null, true)
      })
  }
}