// Initializes the `tiers` service on path `/tiers`
const { ProgramContract } = require("./program-contract.class");
const hooks = require("./program-contract.hooks");
const { authenticate } = require("@feathersjs/authentication").hooks;
// const { web3, contracts, account } = require("../../web3");
const ChainID = require("../../constants/chainid");
const { ChocoLavaBank } = require("../../constants/contracts");

module.exports = function (app) {
  const network = app.get('network');
  const web3 = app.get('web3Client');
  const contract = app.get('contractClient');
  const account = app.get('accountClient');

  // Initialize our service with any options it requires
  app.use("/program-contract", {
    find: () => {
      return "program-contract";
    }
  });

  app.use("/program-contract/balance", {
    find: async (req) => {
      console.log("req.query.account_id :>> ", req.query.account_id);
      let gasPrice = await web3.eth.getGasPrice();
      var myContract = new web3.eth.Contract(
        contract,
        ChocoLavaBank[ChainID[network]],
        {
          from: req.query.account_id,
          gasPrice,
        }
      );
      let data = await myContract.methods
        .getAccBalance(req.query.account_id)
        .call({ from: req.query.account_id, gasPrice })
        .then(function (result) {
          console.log(result + " wei");
          return result + " wei";
        })
        .catch((err) => {
          console.log(err);
          return err;
        });

      return data;
    },
  });

  app.use("/program-contract/withdraw", {
    update: async (id, data, params) => {
      console.log("--Req Params--");
      console.log(data);
      console.log(params);
      console.log("account :>> ", account);
      let gasPrice = await web3.eth.getGasPrice();
      var myContract = new web3.eth.Contract(
        contract,
        ChocoLavaBank[ChainID[network]],
        {
          from: account.address,
          gasPrice,
        }
      );
      let data1 = await myContract.methods
        .withdraw(params.query.amount)
        .send({ from: account.address, gasPrice })
        .then(async function (result) {
          console.log(result);
          return await myContract.methods
            .balance()
            .call({ from: account.address, gasPrice })
            .then(function (balance) {
              console.log("Check Balance ", balance);
              return balance + " wei";
            })
            .catch((err) => {
              console.log(err);
              return "Transaction Failure! Balance Update failed";
            });
        })
        .catch((err) => console.log(err));

      return data1;
    },
  });

  // app.service('program-contract/').hooks({
  //   before: {
  //     all: [authenticate('jwt')]
  //   }
  // });

  // Get our initialized service so that we can register hooks
  const service = app.service("program-contract");

  service.hooks(hooks);
};
