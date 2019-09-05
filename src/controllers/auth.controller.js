const passport = require("passport")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const fs = require("fs")

const IdentityUser = require("../models/identity.user.model")
const ModelUser = require("../models/user.model")
const VerificationToken = require("../models/verificationtoken.model")
const Mailer = require("../util/mailer")
const ErrorMessage = require("../util/error-message")
const validator = require("../util/validator")

module.exports = {

  loginUser(req, res, next) {
    passport.authenticate("local", (err, idUser, info) => { //Use passport to check if the credentials are correct
      if (!err) {
        if (idUser) {

          const privateKey = fs.readFileSync('environment/keys/private_key.pem')

          try {
            var payload = {
              userID: idUser.IdentityUserID,
              email: idUser.Email,
              role: idUser.Role
            }

            var token = jwt.sign(payload, privateKey, {
              expiresIn: '1h',
              algorithm: 'RS256'
            })

            res.status(200).json({ token }).end()

          } catch (err) {
            res.status(400).json(new ErrorMessage("JWTCreationError", 'something went wrong while creating a jwt token' + err, 400)).end()
          }


        } else next(new ErrorMessage("LookupUserError", info, 401))
      } else next(new ErrorMessage("JWTTokenAuthenticationError", err, 401))
    })(req, res)
  },


  registerUser(req, res, next) {
    validator.validateRegisterUserBody(req.body).then(() => {
      const { firstname, middlename, lastname, email, password, passwordConf } = req.body

      if (password === passwordConf) {

        const passwordSalt = crypto.randomBytes(16).toString("hex")
        var hash = crypto.createHmac('sha512', passwordSalt)
        hash.update(password)

        var passwordHash = hash.digest('hex')

        //Create a new user if the email doesnt exists in the database
        IdentityUser.findOrCreate({
          where: { Email: email },
          defaults: {
            FirstName: firstname,
            MiddleName: middlename,
            LastName: lastname,
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
              res.status(201).json({ "message": "success", payload }).end() //Return token so the user is logged in when registered  

            }).catch(err => next(new ErrorMessage("CreateVerificationTokenError", `${err}`, 400)))
          } else next(new ErrorMessage("DuplicateEmailError", `User with email ${email} already exists`, 400))
        }).catch(err => next(new ErrorMessage("LookupIdentityUserError", `${err}`, 400)))
      } else next(new ErrorMessage("PasswordMismatchError", `Passwords don't match`, 400))
    }).catch(e => next(new ErrorMessage("RequestBodyError", e, 400)))
  },

  //TODO: Add input validation
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
                      } else next(new ErrorMessage("AlreadyVerifiedEmailError", `There already exists an Account with email ${iduser.Email}`, 200))
                    }).catch(err => next(new ErrorMessage("NoModelUserFound", `${err}`, 400)))
                  }).catch(err => next(new ErrorMessage("NoIdentityUserFound", `${err}`, 400)))
                }).catch(err => next(new ErrorMessage("DestroyTokenError", `${err}`, 400)))
              }).catch(err => next(new ErrorMessage("IdentityUserUpdateError", `${err}`, 400)))
          } else next(new ErrorMessage("ExpiredTokenError", `Token has expired. Please request a new token for IdentityUserID ${IdentityUserID}`, 200))
        } else next(new ErrorMessage("TokenMismatchError", `Token ${Token} did not match registered token for IdentityUserID ${IdentityUserID}`, 400))
      } else next(new ErrorMessage("TokenMissingError", `No token with IdentityUserID ${IdentityUserID} found`, 200))
    }).catch(err => next(new ErrorMessage("TokenVerificationError", `${err}`, 400)))
  },


  resendVerificationEmail(req, res, next) {

  },



  getPublicKey(req, res, next) {

  }
}