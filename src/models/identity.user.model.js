const Sequelize = require("sequelize")
const crypto = require("crypto")

const db = require("../config/identity-database")

const IdentityUser = db.define("identity-user", {
  id: {
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

  passwordHash: {
    type: Sequelize.STRING
  },

  passwordSalt: {
    type: Sequelize.STRING
  }
},
{
  instanceMethods: {
    validatePassword: function(password) {  
      let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha256").toString("hex")
      return this.hash === hash
    },

    generateToken: function() {   
      let exp = new Date()
      exp.setDate(exp.getDate() + 7)  
      
      const token = jwt.sign({
        _id: this._id,
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        role: this.role,
        admin: this.admin,
        driver: this.driver,
        exp: parseInt(exp.getTime() / 1000)
      }, process.env.SECRET)
    
      return token
    }
  }
})

module.exports = IdentityUser

// // Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// // sometimes causes errors on Windows machines
// // Creating our User model
// module.exports = function(sequelize, DataTypes) {
//   var User = sequelize.define("User", {
//     // The email cannot be null, and must be a proper email before creation
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true
//       }
//     },
//     // The password cannot be null
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   });
//   // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
//   User.prototype.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
//   };
//   // Hooks are automatic methods that run during various phases of the User Model lifecycle
//   // In this case, before a User is created, we will automatically hash their password
//   User.hook("beforeCreate", function(user) {
//     user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
//   });
//   return User;
// };