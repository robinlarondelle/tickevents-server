const routes = require('express').Router();
const tokenController = require("../controllers/token.controller")

routes.post(`/extend`, tokenController.extendToken)

module.exports = routes