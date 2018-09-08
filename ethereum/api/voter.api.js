const web3 = require('../web3');
const Election = require('../election');

const voterState = {
    "0": "None",
    "1": "VoteAble",
    "2": "Voted"
};

const addVoterToVoterList = async (electionAddress, ownerAddress, voterAddress) =>
    await Election(electionAddress).methods.addVoterToVoterList(voterAddress)
        .send({from: ownerAddress});

const removeVoterFromVoterList = async (electionAddress, ownerAddress, voterAddress) =>
    await Election(electionAddress).methods.removeVoterFromVoterList(voterAddress)
    .send({from: ownerAddress});

const getVoterCount = async (electionAddress) =>
    await Election(electionAddress).methods.getVoterCount().call();

const getVoterState = async (electionAddress, voterAddress) => {
    const rawVoterState = await Election(electionAddress).methods.getVoterState(voterAddress).call();
    return voterState[rawVoterState];
};

module.exports = {
    addVoterToVoterList,
    removeVoterFromVoterList,
    getVoterCount,
    getVoterState
};