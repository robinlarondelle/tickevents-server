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
  const { passwordSalt } = user

  var pre_hash = crypto.createHmac('sha512', passwordSalt)
  pre_hash.update(password)
  var hash = pre_hash.digest('hex')

  return user.passwordHash == hash
}

// Exporting our configured passport
module.exports = passport;