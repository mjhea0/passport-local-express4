const Election = require('../election');

const addCandidate = async (electionAddress, ownerAddress,
                            candidateName, commitment) =>
    await Election(electionAddress).methods.addCandidate(candidateName, commitment)
        .send({from: ownerAddress});

const removeCandidate = async (electionAddress, ownerAddress,
                               candidateIndex) =>
    await Election(electionAddress).methods.removeCandidate(candidateIndex)
        .send({from: ownerAddress});

const getCandidate = async (election, index) => {
    const rawCandidate = await election.methods.getCandidate(index).call();
    return {
        "name": rawCandidate["0"],
        "commitment": rawCandidate["1"]
    };
};

const getCandidateLength = async (electionAddress) =>
    await Election(electionAddress).methods.getCandidateLength().call();

const getCandidateList = async (electionAddress) => {
    let candidateList = [];
    const election = Election(electionAddress);
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
    getCandidateLength,
    // Custom methods
    getCandidateList
};