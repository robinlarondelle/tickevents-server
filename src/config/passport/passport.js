const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const IdentityUser = require("../../models/identity.user.model")


passport.use(new LocalStrategy({ //Creating a new local stategy to log a user in with email and password
  usernameField: "email"
}, (email, password, done) => { // Callback function
  IdentityUser.findOne({ where: { email } }).then(dbUser => {
    if (!dbUser) return done(null, false, { message: "Incorrect email." }) //If no email found
    else if (!dbUser.validPassword(password)) { //If no valid password
      return done(null, false, { message: "Incorrect password." })
    }

    return done(null, dbUser);
  })
}
))

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Exporting our configured passport
module.exports = passport;