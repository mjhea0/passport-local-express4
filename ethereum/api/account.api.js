const web3 = require('../web3');

module.exports = {
    makeNewAccount: async (password) =>
        await web3.eth.accounts.create(password)
};