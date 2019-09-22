const Sequelize = require("sequelize")
const db = require("../config/identity-database")

const IdentityUser = db.define("IdentityUsers", {
  identityUserID: {
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

  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  middleName: {
    type: Sequelize.STRING,
    allowNull: true
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  role: {
    type: Sequelize.ENUM([
      'customer',
      'admin',
      'event-owner'
    ])
  },

  emailConfirmedYN: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },

  passwordHash: {
    type: Sequelize.STRING
  },

  passwordSalt: {
    type: Sequelize.STRING
  }
})

module.exports = IdentityUser
