const web3 = require('../ethereum/web3');
const Election = require('../ethereum/election');
const Factory = require('../ethereum/factory');

module.exports = {
    // Contract Methods
    isOwner: async (electionAddress, address) =>
        await Election(electionAddress).methods.isOwner(address).call(),
    getOwner: async (electionAddress) =>
        await Election(electionAddress).methods.getOwner().call(),
    isFiniteElection: async (electionAddress) =>
        await Election(electionAddress).methods.isFiniteElection().call(),
    getBallotCount: async (electionAddress) =>
        await Election(electionAddress).methods.getBallotCount().call(),
    getPublicKeyOfHe: async (electionAddress) =>
        await Election(electionAddress).methods.getPublicKeyOfHe().call(),
    getElectionSummary: async (electionAddress) =>
        await Election(electionAddress).methods.getElectionSummary().call(),
    setElectionDescription: async (electionAddress, voterAddress, electionDescription) =>
        await Election(electionAddress).methods.setElectionDescription(electionDescription).send({from: voterAddress}),
    setElectionState: async (electionAddress, voterAddress, electionState) =>
        await Election(electionAddress).methods.setElectionState(electionState).send({from: voterAddress}),
    setElectionDate: async (electionAddress, voterAddress, startDate, endDate) =>
        await Election(electionAddress).methods.setElectionDate(startDate, endDate).send({from: voterAddress}),
    vote: async (electionAddress, voterAddress, candidateIndex) => {
        const ownerAddress = await Election(electionAddress).methods.getOwner().call();
        // console.log(ownerAddress);
        return await Election(electionAddress)
            .methods.vote(candidateIndex, voterAddress)
            .send({from: ownerAddress});
    },
    // Custom Methods
    getElectionSummaryList: async (isFiniteElection) => {
        const electionAddressList = await Factory.getDeployedElections(isFiniteElection);
        const electionSummaryList = await electionAddressList.map(
            async (electionAddress) => await getElectionSummary(electionAddress));
        return await Promise.all(electionSummaryList);
    }
};
