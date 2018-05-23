const web3 = require('./web3');
const contractAddress = require('../config/contract-address');

const VoteFactory = require('../build/contracts/VoteFactory.json');

const instance = new web3.eth.Contract(VoteFactory.abi, contractAddress.factory);

module.exports = instance;
