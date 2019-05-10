const passport = require("passport")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const moment = require("moment")

const IdentityUser = require("../models/identity.user.model")
const ModelUser = require("../models/user.model")
const VerificationToken = require("../models/verificationtoken.model")
const Mailer = require("../util/mailer")
const ApiMessage = require("../util/apimessage")

module.exports = {

  loginUser(req, res, next) {    
    passport.authenticate("local", (err, user, info) => { //Use passport to check if the credentials are correct
      if (!err) {
        if (user) {

          const payload = { token: generateJWTToken(user) }
          res.status(200).json(payload).end() //Send JWT token when valid credentials

        } else next(new ApiMessage(info, 401))
      } else next(new ApiMessage("Error: " + err, 404))
    })(req, res)
  },


  registerUser(req, res, next) {
    const { firstName, middleName, lastName, email, password, passwordConf } = req.body

    if (password === passwordConf) {
      const passwordSalt = crypto.randomBytes(16).toString("hex")
      const passwordHash = crypto.pbkdf2Sync(password, passwordSalt, 1000, 64, "sha256").toString("hex")

      //Create a new user if the email doesnt exists in the database
      IdentityUser.findOrCreate({
        where: { Email: email },
        defaults: {
          FirstName: firstName,
          MiddleName: middleName,
          LastName: lastName,
          PasswordSalt: passwordSalt,
          PasswordHash: passwordHash,
        }
      }).then(([iduser, created]) => {
        if (created) {
          const jwtToken = generateJWTToken(iduser)
          const payload = { token: jwtToken }

          //Create a new token to be send to the user to verify their email
          VerificationToken.create({
            IdentityUserID: iduser.IdentityUserID,
            Token: crypto.randomBytes(16).toString('hex')
          }).then(token => {

            Mailer.sendVerificationEmail(iduser.Email, token.Token, jwtToken, iduser.IdentityUserID) //Send verifictation email to newly registered user
            res.status(201).json({"message": "success", payload }).end() //Return token so the user is logged in when registered  

          }).catch(err => next(new ApiMessage(`Error occured: ${err}`, 200)))
        } else  next(new ApiMessage(`DuplicateEmailError: User with email ${email} already exists`, 200))
      }).catch(err => next(new ApiMessage(`Error occured: ${err}`, 200)))
    } else next(new ApiMessage(`PasswordDontMatchError: Passwords don't match`, 200))
  },


  verifyEmail(req, res, next) {
    const { IdentityUserID, Token } = req.body

      VerificationToken.findOne({ where: { IDentityUserID: IdentityUserID } }).then(token => {
        if (token) { //Check if there was a token found with given UserID
          if (token.Token == Token) { //Check if the given token matches the registered token

            //Get current date and date of token creation to calculate difference
            creationDate = moment(token.createdAt)
            today = moment()

            //Calculate difference between token generation and moment of request
            const differenceInHours = moment.duration(today.diff(creationDate)).asHours()
            if (differenceInHours <= 24) {

              IdentityUser.update({ // Set Email Confirmed Property to true
                EmailConfirmedYN: true
              }, {
                  where: { IdentityUserID: IdentityUserID }
                }).then(updated => {

                  //Remove used token from database
                  VerificationToken.destroy({ where: { VerificationTokenID: token.VerificationTokenID } }).then(destroyed => {
                    IdentityUser.findOne({ where: { IdentityUserID: IdentityUserID } }).then(iduser => {
                      ModelUser.findOrCreate({ //Create a new user with known details in the Model Database
                        where: { Email: iduser.Email }, defaults: {
                          FirstName: iduser.FirstName,
                          MiddleName: iduser.MiddleName,
                          LastName: iduser.LastName
                        }
                      }).then(([user, created]) => {
                        if (created) {

                          const payload = {
                            "user-created": "success",
                            "email-verified": "success",
                            user: user,
                            "token": jwt
                          }
                          res.status(201).json(payload).end()
                        } else next(new ApiMessage(`AlreadyVerifiedEmailError: There already exists an Account with email ${iduser.Email}`, 200))
                      }).catch(err => next(new ApiMessage(`Error occured: ${err}`)))
                    }).catch(err => next(new ApiMessage(`Error occured: ${err}`)))
                  }).catch(err => next(new ApiMessage(`Error occured: ${err}`)))
                }).catch(err => next(new ApiMessage(`Error occured: ${err}`)))
            } else next(new ApiMessage(`ExpiredTokenError: Token has expired. Please request a new token for IdentityUserID ${IdentityUserID}`, 200))
          } else next(new ApiMessage(`TokenMismatchError: Token ${Token} did not match registered token for IdentityUserID ${IdentityUserID}`))
        } else next(new ApiMessage(`TokenMissingError: No token with IdentityUserID ${IdentityUserID} found`, 200))
      }).catch(err => next(new ApiMessage(`Error occured: ${err}`)))
  },

  resendVerificationEmail(req, res, next) {

  }
}


//Create a new JWT token
function generateJWTToken(user) {
  let exp = new Date()
  exp.setDate(exp.getDate() + 1) //Token expires in 1 day
  // exp.setSeconds(exp.getSeconds() + 20) // Token is 20 seconds valid

  const token = jwt.sign({
    id: user.IdentityUserID,
    email: user.Email,
    exp: parseInt(exp.getTime() / 1000)
  }, process.env.SECRET)

  return token
}