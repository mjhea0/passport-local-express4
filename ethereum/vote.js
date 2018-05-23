const web3 = require('./web3');
const Vote = require('../build/contracts/Vote.json');

module.exports = (address) => {
  return new web3.eth.Contract(Vote.abi, address);
};
