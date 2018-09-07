const web3 = require('../ethereum/web3');

const Vote = require('../ethereum/election');


const makeNewAccount = async (password) => {
    return await web3.eth.accounts.create(password);
};

module.exports = {
    makeNewAccount
};