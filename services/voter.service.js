const web3 = require('../ethereum/web3');

const Vote = require('../ethereum/vote');

const getVoterState = async (voteAddress, voterAddress) => {
    return await Vote(voteAddress).methods.getVoterState(voterAddress).call();
};

const isOwner = async (voteAddress, voterAddress) => {
    return await Vote(voteAddress).methods.isOwner(voterAddress).call();
};

module.exports = {
    getVoterState,
    isOwner
};