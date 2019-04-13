const User = require("../models/user.model")

module.exports = {
  getUsers(req, res, next) {
    res.status(200).json({message: "successfull response"}).end()
  }
}