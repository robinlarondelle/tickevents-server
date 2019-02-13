const passport = require("passport")
const ApiMessage = require("../util/ApiMessage")
const crypto = require("crypto")
let jwt = require("jsonwebtoken")
const Sequelize = require("sequelize")
const db = require("../config/models-database")
const User = require("../models/user.model")
const Ticket = require("../models/ticket.model")
const Event = require("../models/event.model")
const IdentityUser = require("../models/identity.user.model")

module.exports = {
  validateUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (!err) {
        if (user) {
          res.status(200).json({ token: user.generateToken() }).end()
        } else next(new ApiMessage("Geen gebruiker gevonden. info: " + info, 404))
      } else next(new ApiMessage("Error: " + err, 400))
    })(req, res)
  },

  registerUser(req, res, next) {    
    const { email, password, passwordconf} = req.body
    if (password === passwordconf) {

      IdentityUser.findOne({where: {email: email}}).then(user => {        
        if (!user) {
          const passwordSalt = crypto.randomBytes(16).toString("hex")
          const passwordHash = crypto.pbkdf2Sync(req.body.password, passwordSalt, 1000, 64, "sha256").toString("hex") 
          IdentityUser.create({email, passwordHash, passwordSalt}).then(user => {
            console.log(user.email);
            const payload = {
              token: genereateToken(user)
            }
            res.status(200).json(payload).end()
          })} 
        else next(new ApiMessage("Email already exists"))})
    } else next(new ApiMessage("Passwords don't match", 401))

    
  }
}

function genereateToken(user)  {  
    let exp = new Date()
    exp.setDate(exp.getDate() + 7)  
    
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      exp: parseInt(exp.getTime() / 1000)
    }, process.env.SECRET)
  
    return token
  }