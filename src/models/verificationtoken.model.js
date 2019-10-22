const Sequelize = require("sequelize")
const db = require("../config/identity-database")
const moment = require("moment")
const verificationToken = db.define('VerificationTokens', {

  verificationTokenID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  
  identityUserID: {
    type: Sequelize.INTEGER,
    references: {
      model: "IdentityUsers",
      key: 'identityUserID'
    }
  },

  token: {
    type: Sequelize.STRING,
    allowNull: false
  },

  validUntill: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: new Date(new Date().getTime() + 1000 * 60 * 60 * 1) //1 hour ahead
  }
}, {
  freezeTableName: true
})

module.exports = verificationToken