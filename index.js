// index.js
const { contract } = require("./contracts");
const { requestValidator } = require("./validator");
const { responseValidator } = require("./responseValidator");

module.exports = {
    contract,
    guard: requestValidator,
    validateResponse: responseValidator
};