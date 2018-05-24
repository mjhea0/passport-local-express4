const web3 = require('../ethereum/web3');

const Vote = require('../ethereum/vote');

const getNumVoters = async (voteAddress) => {
    return await Vote(voteAddress).methods.getNumVoters().call();
};

const getVoterState = async (voteAddress, voterAddress) => {
    return await Vote(voteAddress).methods.getVoterState(voterAddress).call();
};

module.exports = {
    getNumVoters,
    getVoterState
};