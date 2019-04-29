const User = require("../models/user.model")
const ApiMessage = require("../util/ApiMessage")

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
    const body = req.body

    User.findOrCreate({ //Create a new User from the req body and check if the email already exists
      where: { Email: body.Email },
      defaults: {
        FirstName: body.Firstname,
        MiddleName: body.Middlename,
        LastName: body.Lastname,
        Gender: body.Gender,
        Address: body.Address,
        Zipcode: body.Zipcode,
        City: body.City,
        Country: body.Country,
        PhoneNumber: body.PhoneNumber,
        IBAN: body.IBAN
      }
    }).then(([user, created]) => {
      if (created) { // No email found, so creating a new user
        res
          .status(201)
          .json(new ApiMessage({
            "user-created": "success",
            user: user
          }, 201))
          .end()

      } else next(new ApiMessage(`User with email ${body.Email} already exists`, 200))
    }).catch(err => next(new ApiMessage(`Error occured: ${err}`, 501)))
  },

  //TBD
  editUserById(req, res, next) {
    res.status(200).json({ message: "successfull response" }).end()
  }
}