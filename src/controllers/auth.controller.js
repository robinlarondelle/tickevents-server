const passport = require("passport")
const ApiMessage = require("../models/ApiMessage")

module.exports = {
  login(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if(!err) {
        if (user) {
          res.status(200).json({token: user.generateToken()}).end()
        } else next(new ApiMessage("Geen gebruiker gevonden. info: "+ info, 404))
      } else next(new ApiMessage("Error: " + err, 400))
    })(req, res)
  }
}