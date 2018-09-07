const web3 = require('./web3');
const contractAddress = require('../config/contract-address');
const ElectionFactory = require('../build/contracts/ElectionFactory.json');

const instance = new web3.eth.Contract(ElectionFactory.abi, contractAddress.factory);

module.exports = instance;
