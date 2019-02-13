const Sequelize = require("sequelize")
const crypto = require("crypto")

const db = require("../config/identity-database")

const IdentityUser = db.define("identity-user", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    unique: true
  },

  passwordHash: {
    type: Sequelize.STRING
  },

  passwordSalt: {
    type: Sequelize.STRING
  }
})

module.exports = IdentityUser
