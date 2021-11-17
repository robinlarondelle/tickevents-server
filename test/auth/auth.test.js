const expect = require('chai').expect;
const asserttype = require('chai-asserttype');
const rewire = require("rewire")
const auth = rewire("../../src/controllers/auth.controller.js")

describe("Auth tests", () => {
    describe("function generatePassword test", () => {

        //Thanks to the NPM package rewire, we can get acces to non-exported functions
        const generatePassword = auth.__get__('generatePasswordAsync')
        const testPassword = "testPassword123!"

        it("Should return a different password", () => {
            generatePassword(testPassword).then(result => {
                expect(result).to.not.equal(testPassword)
            })
        }),

        it("The response of the function should be a string with a dot in the middle", () => {
            generatePassword(testPassword).then(result => {
                expect(result).to.be.string()
                expect(result.split(".").length).to.equal(2)
            })
        }),

        it("The hash must be able to be decrypted using the salt and hash", () => {
            generatePassword(testPassword).then(result => {
                expect(result).to.not.equal(testPassword)
            })
        })
    })
})