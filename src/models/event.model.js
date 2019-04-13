const Sequelize = require("sequelize")
const db = require("../config/models-database")

const event = db.define("event", {
  EVENT_ID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  USER_ID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: 'USER_ID'
    }
  },

  EVENT_NAME: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  EVENT_LOCATION: {
    type: Sequelize.STRING,
    allowNull: false

  },

  EVENT_DATE: {
    type: Sequelize.DATE,
    allowNull: false
  }

})



module.exports = event;