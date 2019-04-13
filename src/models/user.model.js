const Sequelize = require("sequelize")
const db = require("../config/models-database")

const user = db.define("user", {
  USER_ID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  }
})

module.exports = user;