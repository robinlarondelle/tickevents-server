const Sequelize = require("sequelize")
const db = require("../config/identity-database")

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
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true
})

module.exports = verificationToken