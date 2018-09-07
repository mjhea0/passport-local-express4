const web3 = require('./web3');
const Election = require('../build/contracts/Election.json');

module.exports = (address) => {
  return new web3.eth.Contract(Election.abi, address);
};
