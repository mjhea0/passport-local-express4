const web3 = require('../web3');

const Election = require('../election');

module.exports = {
    addVoterToVoterList: async (electionAddress, ownerAddress, voterAddress) =>
        await Election(electionAddress).methods.addVoterToVoterList(voterAddress)
            .send({from: ownerAddress}),
    removeVoterFromVoterList: async (electionAddress, ownerAddress, voterAddress) =>
        await Election(electionAddress).methods.removeVoterFromVoterList(voterAddress)
            .send({from: ownerAddress}),
    getVoterCount: async (electionAddress) =>
        await Election(electionAddress).methods.getVoterCount().call(),
    getVoterState: async (electionAddress, voterAddress) =>
        await Election(electionAddress).methods.getVoterState(voterAddress).call()
};