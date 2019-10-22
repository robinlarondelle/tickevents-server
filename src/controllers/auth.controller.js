const passport = require("passport")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const fs = require("fs")

const IdentityUser = require("../models/identity.user.model")
const ModelUser = require("../models/user.model")
const VerificationToken = require("../models/verificationtoken.model")
const Mailer = require("../util/mailer")
const ErrorMessage = require("../models/error-message.model")
const validator = require("../util/validator")

module.exports = {

  login(req, res, next) {
    passport.authenticate("local", (err, idUser, info) => { //Use passport to check if the credentials are correct
      if (!err) {
        if (idUser) {

          var payload = {
            identityID: idUser.identityUserID,
            email: idUser.email,
            firstname: idUser.firstname,
            lastname: idUser.lastname,
            role: idUser.role
          }

          generateJWT(payload, (err, token) => {
            if (!!!err) {
              res.status(200).json({ token }).end()
            } else { next(new ErrorMessage("ServerError", err, 400)) }
          })
        } else next(new ErrorMessage("ServerError", info, 401))
      } else {

        //TODO: create logging of invalid login
        switch (err) {
          case "Email not validated": next(new ErrorMessage("EmailValidationError", err, 401))
          case "Incorrect Password" || 'Incorrect email': next(new ErrorMessage("InvalidCredentialsError", "Either your password or your email was not correct", 401))
          default: next(new ErrorMessage("ServerError", err, 401))
        }
      }
    })(req, res)
  },


  register(req, res, next) {
    validator.validateRegisterUserBody(req.body).then(() => {
      const { email, firstname, lastname, password, passwordConf } = req.body

      if (password === passwordConf) {

        generatePassword(password, (err, passwordString) => {
          if (!err) {

            //Create a new user if the email doesnt exists in the database
            IdentityUser.findOrCreate({
              where: { email },
              defaults: {
                firstname,
                lastname,
                password: passwordString
              }
            }).then(([idUser, created]) => {
              if (created) { //user didnt exist

                //Create a new token to be send to the user to verify their email
                VerificationToken.create({
                  identityUserID: idUser.identityUserID,
                  token: crypto.randomBytes(16).toString('hex'),
                  validUntill: moment().add(1, "hours")
                }
                ).then(createdToken => {

                  try {
                    Mailer.sendVerificationEmail(idUser.email, createdToken.token, idUser.identityUserID) //Send verifictation email to newly registered user
                    res.status(201).json({ "message": "success" }).end()
                  } catch (err) { next(new ErrorMessage("ServerError", err, 400)) }
                }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
              } else next(new ErrorMessage("ServerError", err, 400))
            })
          } else next(new ErrorMessage("DuplicateEmailError", `User with email ${email} already exists`, 400))
        }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
      } else next(new ErrorMessage("PasswordsDontMatchError", `Passwords dont match`, 400))
    }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
  },


  //TODO: Add input validation
  verifyEmail(req, res, next) {
    const { identityUserID, token: userToken } = req.body

    VerificationToken.findOne({ where: { identityUserID } }).then(verificationToken => {
      if (verificationToken) { //Check if there was a token found with given UserID
        if (verificationToken.token == userToken) { //Check if the given token matches the registered token

          //Get current date and date of token creation to calculate difference
          expiryDate = moment(verificationToken.validUntill)
          today = moment()

          if (today - expiryDate < 0) { //token is still valid if today - expiryDate is more than 0

            IdentityUser.findByPk(identityUserID).then(identityUser => {
              identityUser.update({ emailConfirmedYN: true }).then(() => {
                verificationToken.destroy().then(() => {
                  ModelUser.findOrCreate({
                    where: {
                      email: identityUser.email
                    }, defaults: {
                      email: identityUser.email,
                      firstname: identityUser.firstname,
                      lastname: identityUser.lastname
                    }
                  }).then(([user, created]) => {

                    if (created) {
                      const payload = {
                        userID: user.userID,
                        identityID: identityUser.identityID,
                        role: identityUser.role
                      }

                      generateJWT(payload, (err, token) => {
                        if (!!!err) {
                          res.status(201).json({ token }).end()
                        } else next(new ErrorMessage("ServerError", err, 400))
                      })
                    } else next(new ErrorMessage("ServerError", err, 400))
                  }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
                }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
              }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
            }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
          } else next(new ErrorMessage("TokenExpiredError", "Token Expired. Please request a new one", 401))
        } else next(new ErrorMessage("TokenMismatchError", `Supplied token ${userToken} did not match registered token for IdentityUserID ${identityUserID}`, 400))
      } else next(new ErrorMessage("NoTokenFoundError", `No token for IdentityUserID ${identityUserID} found`, 400))
    }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
  },


  sendToken(req, res, next) {
    const { email } = req.body

    IdentityUser.findOne({ where: { email } }).then(idUser => {
      if (idUser) {
        VerificationToken.findOne({ where: { identityUserID: idUser.identityUserID } }).then(token => {

          //Clear the old token if it still exists
          if (token) token.destroy().catch(err => next(new ErrorMessage("ServerError", err, 400)))

          VerificationToken.create({
            identityUserID: idUser.identityUserID,
            token: crypto.randomBytes(16).toString('hex')
          }).then(createdToken => {

            const purpose = req.url

            if (purpose == "/tokens/forgot-password") {
              Mailer.sendForgotPasswordMail(idUser.email, idUser.identityUserID, createdToken.token, (err, success) => {
                if (success) res.status(200).json({ "message": "success" }).end()
                else next(new ErrorMessage("ServerError", err, 400))
              })
            } else if (purpose == "/tokens/resend-verification-email") {
              Mailer.sendVerificationEmail(idUser.email, createdToken.token, idUser.identityUserID, (err, success) => {

                if (success) res.status(200).json({ "message": "success" }).end()
                else next(new ErrorMessage("ServerError", err, 400))
              })
            } else next()
          }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
        }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
      } else next(new ErrorMessage("UnknownEmail", `There is no identityUser with email ${email} registered.`, 404))
    }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
  },


  setNewPassword(req, res, next) {
    const { newPassword, newPasswordConf, identityUserID, token } = req.body

    if (newPassword == newPasswordConf) {
      IdentityUser.findByPk(identityUserID).then(idUser => {
        if (idUser) {

          VerificationToken.findOne({ where: { identityUserID } }).then(idUserToken => {
            if (idUserToken) {

              expiryDate = moment(idUserToken.validUntill)
              today = moment()

              if (idUserToken.token == token) {
                if (today - expiryDate < 0) {

                  generatePassword(newPassword, (err, passwordString) => {
                    if (!err) {
                      idUser.update({ password: passwordString }).then(updatedUser => {
                        if (updatedUser) {
                          idUserToken.destroy()
                          
                          res.status(200).json({ "status": "success" }).end()
                        } else next(new ErrorMessage("ServerError", err, 400))
                      }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
                    } else next(new ErrorMessage("ServerError", err, 400))
                  })
                } else next(new ErrorMessage("TokenExpiredError", "The token has expired. Please request a new one", 401))
              } else next(new ErrorMessage("TokensDontMatchError", `The token you supplied doesnt match the known token`, 401))
            } else next(new ErrorMessage("NoTokenForIDentityUserError", `There is no token known for identityUserID ${identityUserID}`, 404))
          }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
        } else next(new ErrorMessage("UnknownIdentityUserID", `There is no IdentityUser with ID ${identityUserID}`, 404))
      }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
    } else { next(new ErrorMessage("PasswordsDontMatchError", "Your passwords dont match", 401)) }
  }
}


function generateJWT(payload, callback) {
  const privateKey = fs.readFileSync('environment/keys/private_key.pem')

  try {
    var token = jwt.sign(payload, privateKey, {
      expiresIn: '1h',
      algorithm: 'RS256'
    })

    callback(null, token)
  } catch (e) {
    callback(e)
  }
}


function generatePassword(plainPassword, callback) {
  try {
    const passwordSalt = crypto.randomBytes(16).toString("hex") // Create the salt
    var hash = crypto.createHmac('sha512', passwordSalt) // Create a hashed string with the salt
    hash.update(plainPassword) // Apply the hash on the password
    var passwordHash = hash.digest('hex') // Transform hash to hexadecimal value
    const passwordString = passwordSalt + "." + passwordHash //Create a new string to be stored in the database

    callback(null, passwordString)

  } catch (e) {
    callback(e, null)
  }
}