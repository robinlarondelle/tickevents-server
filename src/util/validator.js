const User = require("../models/user.model")


module.exports = {
  validateToken(token) {
    return new Promise((resolve, reject) => {
      if (token._id) { //If there is a id parameter in the token
        User.findByPk(token._id ).then(user => {
          if (user) resolve(token) //There is a user found with the ID, so the token is valid
          else reject("Niet geauthorizeerd")
        }).catch(err => reject(err))
      } else reject("Niet geauthorizeerd")
    })
  },
}