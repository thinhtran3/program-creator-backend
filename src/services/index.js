const programContract = require('./program-contract/program-contract.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    app.configure(programContract)
};
