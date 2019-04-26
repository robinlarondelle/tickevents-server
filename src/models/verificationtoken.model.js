const Sequelize = require("sequelize")
const db = require("../config/identity-database")

const verificationToken = db.define('VerificationTokens', {

  VerificationTokenID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  
  IdentityUserID: {
    type: Sequelize.INTEGER,
    references: {
      model: "IdentityUsers",
      key: 'IdentityUserID'
    }
  },

  Token: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
})

module.exports = verificationToken