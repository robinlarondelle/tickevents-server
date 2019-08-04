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
      const {userID, eventID, amountOfTickets, purchaseMethod, productName} = body
      if ( userID, eventID, amountOfTickets, purchaseMethod, productName) {
        resolve()
      } else {
        reject(`one or more parts of the JSON body are missing. Objects needed: userID, eventID, amountOfTickets, purchaseMethod`)
      }
    })
  }
}