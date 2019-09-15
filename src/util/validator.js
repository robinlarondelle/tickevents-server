module.exports = {

  validateRegisterUserBody(body) {
    return new Promise((resolve, reject) => {
      const { firstname, middlename, lastname, email, password, passwordConf } = body
      if (firstname, middlename, lastname, email, password, passwordConf) {
        resolve()
      } else reject("one or more parts of the JSON body are missing. Objects needed: firstname, middlename, lastname, email, password, passwordConf")
    })
  },


  validatePurchaseTicketBody(body) {
    return new Promise((resolve, reject) => {
      const {
        name,
        email,
        dateOfBirth,
        purchase,
        eventID,
      } = body

      if ( 
        name,
        email,
        dateOfBirth,
        purchase,
        eventID
      ) {
        if (purchase.length != 0) {
          resolve()

        } else reject("No tickets selected")
      } else {
        reject(`one or more parts of the JSON body are missing. Please refer to the documentation to see the JSON expected`)
      }
    })
  }
}