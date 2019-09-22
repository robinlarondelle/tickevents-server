const User = require("../models/user.model")
const ErrorMessage = require("../models/error-message.model")

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

  //TBD
  editUserById(req, res, next) {
    res.status(200).json({ message: "successfull response" }).end()
  }
}