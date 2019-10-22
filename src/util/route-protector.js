const IdentityUser = require("../models/identity.user.model")
const VerificationToken = require("../models/verificationtoken.model")
const ErrorMessage = require("../models/error-message.model")

module.exports = {
  
  //Protect the getIdentityUserBuyID route by making sure only the requested user can be fetched using the corresponding token
  //This way, nobody can access the IdentityUsers without a valid verification-token
  getIdentityUserByIDProtetcion(req, res, next) {    
    const {id, token} = req.params

    VerificationToken.findOne({where: {identityUserID: id}}).then(verificationToken => {     
      if (token == verificationToken.token) {
        	next()
      } else next(new ErrorMessage("InvalidTokenError", "Access Denied. The token you supplied doesn't belong to the given identityUserID.", 403))
    }).catch(err => next(new ErrorMessage("UnknownIdentityIDError", `IdentityUser with ID ${req.params.id} was not found.`, 404)))
  }
}