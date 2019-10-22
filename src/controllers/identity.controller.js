const IdentityUser = require("../models/identity.user.model")
const ErrorMessage = require("../models/error-message.model")

module.exports = {
  getIdentityUserByID(req, res, next) {
    IdentityUser.findByPk(req.params.id).then(identityUser => {
      if (!!identityUser) {

        const payload = {
          identityUserID: identityUser.identityUserID,
          email: identityUser.email,
          firstname: identityUser.firstname,
          lastname: identityUser.lastname,
          role: identityUser.role,
          emailConfirmedYN: identityUser.emailConfirmedYN
        }
        res.status(200).json(payload).end()

      } else next(new ErrorMessage("UnknownIdentityIDError", `IdentityUser with ID ${req.params.id} was not found.`, 404))
    }).catch(err => next(new ErrorMessage("ServerError", err, 400)))
  },
}