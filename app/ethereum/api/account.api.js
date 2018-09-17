const web3 = require('../web3');

const makeNewAccount = async (password) =>
    await web3.eth.accounts.create(password);

module.exports = {
    makeNewAccount
};