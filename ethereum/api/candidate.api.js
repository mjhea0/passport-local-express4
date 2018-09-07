const web3 = require('../web3');
const Election = require('../election');

const addCandidate = async (electionAddress, ownerAddress,
                           candidateName, commitment) =>
    await Election(electionAddress).methods.addCandidate(candidateName, commitment)
    .send({from: ownerAddress});

const removeCandidate = async (electionAddress, ownerAddress,
                              candidateIndex) =>
    await Election(electionAddress).methods.removeCandidate(candidateIndex)
    .send({from: ownerAddress});

const getCandidate = async (electionAddress, index) =>
    await Election(electionAddress).methods.getCandidate(index).call();

const getCandidateList = async (voteAddress) => {
    let candidateList = [];
    const election = Election(voteAddress);
    const candidateLength = parseInt(await election.methods.getCandidateLength().call());
    for (let i = 0; i < candidateLength; i++) {
        candidateList.push(await getCandidate(election, i));
    }
    return candidateList
};

module.exports = {
    // Contract methods
    addCandidate,
    removeCandidate,
    getCandidate,
    // Custom methods
    getCandidateList
};