const ApiMessage = requie("../../models/ApiMessage")

module.exports = {
  ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next() // User may continue using the desired route

    next(new ApiMessage("User not authenticated. Please login first or create an account.", 401))
  }
}