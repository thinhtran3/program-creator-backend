let fs = require("fs");
let Web3 = require("web3"); // https://www.npmjs.com/package/web3
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = function (app) {
  const provider = new Web3.providers.HttpProvider(app.get("rpcUrl"));

  const privateKey = app.get("privateKey");

  const localKeyProvider = new HDWalletProvider(privateKey, provider);

  let web3 = new Web3(localKeyProvider);

  let source = fs.readFileSync("./src/abi/ChocoLavaBank.json");
  let contract = JSON.parse(source);

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

	app.set("web3Client", web3);
	app.set("contractClient", contract);
	app.set("accountClient", account);
};
