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

  loginUser(req, res, next) {
    passport.authenticate("local", (err, idUser, info) => { //Use passport to check if the credentials are correct
      if (!err) {
        if (idUser) {

          var payload = {
            identityID: idUser.identityUserID,
            email: idUser.email,
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


  registerUser(req, res, next) {
    validator.validateRegisterUserBody(req.body).then(() => {
      const { email, firstname, lastname, password, passwordConf } = req.body

      if (password === passwordConf) {

        const passwordSalt = crypto.randomBytes(16).toString("hex") // Create the salt
        var hash = crypto.createHmac('sha512', passwordSalt) // Create a hashed string with the salt
        hash.update(password) // Apply the hash on the password
        var passwordHash = hash.digest('hex') // Transform hash to hexadecimal value
        const passwordString = passwordSalt + "." + passwordHash //Create a new string to be stored in the database

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

            IdentityUser.update({ emailConfirmedYN: true }, {
              where: { identityUserID }
            }).then(() => {
              IdentityUser.findByPk(identityUserID).then(idUser => {

                VerificationToken.destroy({
                  where: {
                    verificationTokenID: verificationToken.verificationTokenID
                  }
                }).then(destoyed => {

                  ModelUser.findOrCreate({
                    where: {
                      email: idUser.email
                    }, defaults: {
                      email: idUser.email,
                      firstname: idUser.firstname,
                      lastname: idUser.lastname
                    }
                  }).then(([user, created]) => {

                    if (created) {
                      const payload = {
                        userID: user.userID,
                        identityID: idUser.identityID,
                        role: idUser.role
                      }

                      generateJWT(payload, (err, token) => {
                        if (!!!err) {
                          res.status(201).json({token}).end()
                        } else next(new ErrorMessage("ServerError", err, 400))
                      })
                    } else next(new ErrorMessage("ServerError", err, 400))
                  }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
                }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
              }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
            }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
          } else next(new ErrorMessage("TokenExpiredError", "Token Expired. Please request a new one", 401))
        } else next(new ErrorMessage("TokenMismatchError", `Token ${userToken} did not match registered token for IdentityUserID ${identityUserID}`, 400))
      } else next(new ErrorMessage("TokenMissingError", `No token with IdentityUserID ${identityUserID} found`, 400))
    }).catch(err => next(new ErrorMessage("TokenVerificationError", `${err}`, 400)))
  },


  resendVerificationEmail(req, res, next) {
    const { email } = req.body

    IdentityUser.findOne({ where: { email } }).then(idUser => {
      console.log(idUser);
      const identityUserID = idUser.identityUserID
      VerificationToken.findOne({ where: { identityUserID } }).then(token => {
        console.log(token);

        if (!!token) {
          const verificationTokenID = token.verificationTokenID
          VerificationToken.destroy({ where: { verificationTokenID } }).then(result => {
            console.log(result);
          })
        } else {
          console.log("No Token found");
        }

        VerificationToken.create({
          identityUserID: iduser.identityUserID,
          token: crypto.randomBytes(16).toString('hex')
        }).then(token => {
          console.log(token);
          res.status(200).json({ "message": "success" }).end()

        }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
      }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
    }).catch(err => next(new ErrorMessage("ServerError", err, 400)))

  },


  getPublicKey(req, res, next) {
    res.status(503).end()
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