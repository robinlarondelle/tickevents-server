const passport = require("passport")
const crypto = require("crypto")
const LocalStrategy = require("passport-local").Strategy;
const IdentityUser = require("../../models/identity.user.model")

//Creating a new local stategy to log a user in with email and password
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => { // Callback function
  IdentityUser.findOne({ where: { email } }).then(user => {
    if (user) { //There exists a user with said password
      if (validatePassword(user, password)) {
        return (null, user) //The credentials are valid
      } else done(null, false, { message: "Incorrect password." })
    } else return done(null, false, { message: "Incorrect email." })
  })
}))

//If the hashed password equals the saved hashed password, then it must be equal. This way, we dont have to save the password to the db
function validatePassword(user, password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha256").toString("hex")
  return user.passwordHash === hash
}

// Exporting our configured passport
module.exports = passport;