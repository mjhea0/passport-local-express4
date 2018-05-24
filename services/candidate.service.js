const web3 = require('../ethereum/web3');

const Vote = require('../ethereum/vote');

const getCandidate = async (vote, index) => {
    return await vote.methods.getCandidate(index).call();
};

const getCandidateList = async (voteAddress) => {
    let candidateList = [];
    const vote = Vote(voteAddress);
    const candidateLength = parseInt(await vote.methods.getCandidateLength().call());
    for (let i = 0; i < candidateLength; i++) {
        candidateList.push(await getCandidate(vote, i));
    }
    return candidateList
};

module.exports = {
    getCandidate,
    getCandidateList
};