const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const User = require("../models/user.model")
const IdentityUser = require("../models/identity.user.model")
const ErrorMessage = require("../models/error-message.model")
const StripeDetails = require("../models/stripe-details.model")

module.exports = {
  getUsers(req, res, next) {
    User.findAll().then(users => {
      res.status(200).json(users).end()
    })
  },

  //TODO change response when nothing found
  getUserById(req, res, next) {
    User.findByPk(req.params.id).then(users => {
      res.status(200).json(users).end()
    })
  },

  getIdentityUserByID(req, res, next) {
    IdentityUser.findByPk(req.params.id).then(identityUser => {
      if (!!identityUser) {

        const payload = {
          identityUserID: identityUser.identityUserID,
          email: identityUser.email,
          firstname: identityUser.firstname,
          lastname: identityUser.lastname,
          role: identityUser.role,
          emailConfirmedYN: identityUser.emailConfirmedYN
        }
        res.status(200).json(payload).end()

      } else next(new ErrorMessage("IdentityUserNotFound", `IdentityUser with ID ${req.params.id} was not found.`, 404))
    }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
  },

  createUser(req, res, next) {
    const { firstname, middlename, lastname, gender, address, zipcode, city, country, phoneNumber } = req.body

    User.findOrCreate({ //Create a new User from the req body and check if the email already exists
      where: { email: body.email },
      defaults: {
        firstname,
        middlename,
        lastname,
        gender,
        address,
        zipcode,
        city,
        country,
        phoneNumber
      }
    }).then(([user, created]) => {
      if (created) { // No email found, so creating a new user
        res
          .status(201)

          .json({
            "user-created": "success",
            user: user
          })

          .end()

      } else next(new ErrorMessage("DuplicateEmailError", `User with email ${body.Email} already exists`, 200))
    }).catch(err => next(new ErrorMessage("SearchUserError", `${err}`, 501)))
  },


  fetchStripeCredentials(req, res, next) {
    const { code } = req.body

    stripe.oauth.token({
      grant_type: "authorization_code",
      code
    }).then(result => {
      User.findByPk(req.payload.modelUserID).then(user => {
        if (user) {

          console.log();
          
          StripeDetails.create({
            stripeUserID: result.stripe_user_id,
            userID: user.userID,
            refreshToken: result.refresh_token
          }).then(stripeDetail => {
            if (stripeDetail) {
              console.log(stripeDetail.get());
              
              res.status(200).end()
            } else next(new ErrorMessage("ServerError", `No ModelUser with userID ${req.payload.modelUserID} found.`, 404))
          }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
        } else next(new ErrorMessage("ServerError", `No ModelUser with userID ${req.payload.modelUserID} found.`, 404))
      }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
    }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
  },

  //TBD
  editUserById(req, res, next) {
    res.status(200).json({ message: "successfull response" }).end()
  }
}