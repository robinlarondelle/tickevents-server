const Sequelize = require("sequelize")
const db = require("../config/identity-database")
const roles = Sequelize.ENUM([
  'CUSTOMER',
  'ADMIN',
  'EVENT_OWNER'
])

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

  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },

  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },

  role: {
    type: Sequelize.ENUM,
    values: ['customer', 'event_owner', 'admin', 'ceo'],
    defaultValue: 'customer'
  },

  emailConfirmedYN: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },

  password: {
    type: Sequelize.STRING
  }
})

module.exports = IdentityUser
