const Sequelize = require("sequelize")
const db = require("../config/identity-database")

const identityUser = db.define("identity-user", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  }
})

module.exports = identityUser