const Sequelize = require("sequelize")
const db = require("../config/models-database")

const stripeDetail = db.define("StripeDetails", {
  stripeUserID: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "userID"
    },
    unique: true
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = stripeDetail