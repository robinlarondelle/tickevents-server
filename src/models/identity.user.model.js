const Sequelize = require("sequelize")
const db = require("../config/identity-database")

const IdentityUser = db.define("IdentityUsers", {
  IdentityUserID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  Email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    unique: true
  },

  FirstName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  MiddleName: {
    type: Sequelize.STRING,
    allowNull: true
  },

  LastName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  Role: {
    type: Sequelize.ENUM([
      'customer',
      'admin',
      'event-owner'
    ])
  },

  EmailConfirmedYN: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },

  PasswordHash: {
    type: Sequelize.STRING
  },

  PasswordSalt: {
    type: Sequelize.STRING
  }
})

module.exports = IdentityUser
