const Sequelize = require("sequelize")
const Op = Sequelize.Op;

const IDUser = require("../src/models/identity.user.model")
const modelDb = require("../src/config/models-database")
const identityDb = require("../src/config/identity-database")

before("Sync databases", done => {
  modelDb.sync({ force: false, logging: false }).then(() => {
    identityDb.sync({ force: false, logging: false }).then(() => {
      IDUser.destroy({
        where: {
          email: {
            [Op.notLike]: "test@test.nl" //Clear the ID database except superuser for token usage
          }
        }
      }).then(res => done()
      ).catch(err => console.log(err))
    }).catch(err => console.log("An error occured when syncing the identity database: \n\n" + err))
  }).catch(err => console.log("An error occured when syncing the database: \n\n" + err))
})


it("Should pass", done => {
  done()

})