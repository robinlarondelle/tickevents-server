const Sequelize = require("sequelize")
const db = require("../config/database")

const user = db.define("user", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  }
})

module.exports = user;