const fs = require('fs')
const readline = require('readline')
const identityDatabase = require(`../config/identity-database`)
const modelDatabase = require(`../config/models-database`)


//Models
const IdentityUser = require(`../models/identity.user.model`)
const ModelUser = require('../models/user.model')


module.exports = {
  seeddatabase() {

    ModelUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No ModelUsers found in database, seeding new ModelUsers`);

        //Seeding Table IdentityUsers
        const userStream = readline.createInterface({ input: fs.createReadStream('./scripts/sd_users.sql') })
        userStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
          console.log("Done seeding ModelUsers! \n");
        })
      }
    })

    
    IdentityUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No IdentityUsers found in database, seeding new IdentityUsers`);

        //Seeding Table IdentityUsers
        const identityUserStream = readline.createInterface({ input: fs.createReadStream('./scripts/sd_identity_users.sql') })
        identityUserStream.on('line', (line) => identityDatabase.query(`${line}`)).once("close", () => {
          console.log("Done seeding IdentityUsers! \n");
        })
      }
    })
  }
}