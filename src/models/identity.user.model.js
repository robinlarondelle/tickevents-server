const Sequelize = require("sequelize")
const db = require("../config/identity-database")

const IdentityUser = db.define("identity-user", {
  ID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  EMAIL: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    unique: true
  },

  FIRSTNAME: {
    type: Sequelize.STRING,
    allowNull: false
  },

  LASTNAME: {
    type: Sequelize.STRING,
    allowNull: false
  },

  EMAIL_CONFIRMED_YN: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },

  PASSWORD_HASH: {
    type: Sequelize.STRING
  },

  PASSWORD_SALT: {
    type: Sequelize.STRING
  }
})

module.exports = IdentityUser
