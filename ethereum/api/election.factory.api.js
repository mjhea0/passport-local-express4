const web3 = require('../web3');
const ElectionFactory = require('../factory');

module.exports = {
    getDeployedElections: async (isFinite) =>
        await ElectionFactory.methods.getDeployedElections(isFinite).call(),
    getDeployedElectionsLength: async (isFinite) =>
        await ElectionFactory.methods.getDeployedElectionsLength(isFinite).call(),
    makeNewVote: async (adminAddress,
                        electionName,
                        electionDescription,
                        electionOwner,
                        startDate,
                        endDate,
                        publicKeyOfHe,
                        finiteElection) =>
        await ElectionFactory.methods.makeNewVote(
            electionName,
            electionDescription,
            electionOwner,
            startDate,
            endDate,
            publicKeyOfHe,
            finiteElection
        ).send({from: adminAddress})
};
