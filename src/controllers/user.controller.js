const User = require("../models/user.model")

module.exports = {
  getUsers(req, res, next) {
    res.status(200).json({message: "successfull response"}).end()
  },

  getUserById(req, res, next) {
    res.status(200).json({message: "successfull response"}).end()
  },

  createUser(req, res, next) {
    res.status(200).json({message: "successfull response"}).end()
  },

  editUserById(req, res, next) {
    res.status(200).json({message: "successfull response"}).end()
  },

  deleteUserById(req, res, next) {
    res.status(200).json({message: "successfull response"}).end()
  }
}