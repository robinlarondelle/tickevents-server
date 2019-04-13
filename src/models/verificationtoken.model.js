const Sequelize = require("sequelize")
const db = require("../config/identity-database")

const verificationToken = db.define('verification-tokens', {

  VerificationTokenID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  
  IdentityUserID: {
    type: Sequelize.INTEGER,
    references: {
      model: "identity-users",
      key: 'IdentityUserID'
    }
  },

  Token: {
    type: Sequelize.STRING
  }
})

module.exports = verificationToken