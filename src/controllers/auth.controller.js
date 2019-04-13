const passport = require("passport")
const ApiMessage = require("../util/ApiMessage")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const IdentityUser = require("../models/identity.user.model")
const VerificationToken = require("../models/verificationtoken.model")
const Mailer = require("../util/mailer")

module.exports = {
  loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => { //Use passport to check if the credentials are correct
      if (!err) {
        if (user) {

          const payload = {
            token: generateToken(user)
          }
          res.status(200).json(payload).end() //Send JWT token when valid credentials

        } else next(new ApiMessage(info, 401))
      } else next(new ApiMessage("Error: " + err, 404))
    })(req, res)
  },

  registerUser(req, res, next) {
    const body = req.body

    if (body.Password === body.Passwordconf) {      
      const passwordSalt = crypto.randomBytes(16).toString("hex")
      const passwordHash = crypto.pbkdf2Sync(body.Password, passwordSalt, 1000, 64, "sha256").toString("hex")
      
      IdentityUser.findOrCreate({
        where: { Email : body.Email },
        defaults: {
          FirstName: body.Firstname,
          LastName: body.Lastname,
          PasswordSalt: passwordSalt,
          PasswordHash: passwordHash,
        }
      }).then(([user, created]) => {        
        if (created) {
          const payload = { token: generateToken(user) }
          console.log(user.get({plane: true}));
          
          VerificationToken.create({
            IdentityUserID: user.IdentityUserID,
            Token: crypto.randomBytes(16)
          }).then(token => {

            Mailer.sendVerificationEmail(user.Email, token) //Send verifictation email to newly registered user
            res.status(200).json(payload).end() //Return token so the user is logged in when registered  

          }).catch(err => next(new ApiMessage(`Error occured: ${err}`, 401)))
        } else next(new ApiMessage(`User with email ${Email} already exists`, 200))
      }).catch(err => next(new ApiMessage(`Error occured: ${err}`, 401)))
    } else next(new ApiMessage("Passwords don't match", 401))
  }
}

      // //Create a new user if there doesnt already exists one. Throw error if email exists
      // IdentityUser.findOne({ where: { email: email } }).then(user => {
      //   if (!user) {

      //     //Create a Salt and hash combination to store a password. This way, we secure the user password
      //     const passwordSalt = crypto.randomBytes(16).toString("hex")
      //     const passwordHash = crypto.pbkdf2Sync(req.body.password, passwordSalt, 1000, 64, "sha256").toString("hex")
      //     IdentityUser.create({ email, passwordHash, passwordSalt }).then(user => {
      //       const payload = {
      //         token: generateToken(user)
      //       }

      //       VerificationToken.create({
      //         IdentityUserID: user.IdentityUserID,
      //         Token: crypto.randomBytes()
      //       }).then(token => {
      //         Mailer.sendVerificationEmail(email, token) //Send verifictation email to newly registered user
      //         res.status(200).json(payload).end() //Return token so the user is logged in when registered  
      //       })
      //     })
      //   }

      //   else next(new ApiMessage("Email already exists", 401))
      // })

function generateToken(user) {
  let exp = new Date()
  // exp.setDate(exp.getDate() + 1) //Token expires in 1 day
  exp.setSeconds(exp.getSeconds() + 20) // Token is 10 seconds valid

  const token = jwt.sign({
    id: user.IdentityUserID,
    email: user.Email,
    exp: parseInt(exp.getTime() / 1000)
  }, process.env.SECRET)

  return token
}