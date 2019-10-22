const passport = require("passport")
const crypto = require("crypto")
const LocalStrategy = require("passport-local").Strategy;
const IdentityUser = require("../../models/identity.user.model")


// this is the function responsible for checking user credentials and validating passwords
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => { // Callback function
  IdentityUser.findOne({ where: { email } }).then(user => {
    if (user) { //There exists a user with said password   
      if (user.emailConfirmedYN) {
        if (validatePassword(user, password)) {

          return done(null, user) //The credentials are valid

        } else done("Incorrect Password", false)
      } else done("Email not validated", false)
    } else return done("Incorrect email", false)
  }).catch(err => { return done("Error: " + err, false) })
}))


//If the hashed password equals the saved hashed password, then it must be equal. This way, we dont have to save the password to the db
function validatePassword(user, password) {
  const passwordSalt = user.password.split(".")[0]
  const passwordHash = user.password.split(".")[1]

  var hash = crypto.createHmac('sha512', passwordSalt)
  hash.update(password)
  var passwordString = hash.digest('hex')

  return passwordHash == passwordString
}


// Exporting our configured passport
module.exports = passport;