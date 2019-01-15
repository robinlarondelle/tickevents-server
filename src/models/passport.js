const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const queries = require("../database/queries/auth.queries")

passport.use(new LocalStrategy({
  usernameField: "email"
}, (username, password, done) => {  
  //Make query to database to log user in
}))