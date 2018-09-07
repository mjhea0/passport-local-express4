const web3 = require('../web3');
const ElectionFactory = require('../factory');

const getDeployedElections = async (isFinite) =>
    await ElectionFactory.methods.getDeployedElections(isFinite).call();

const getDeployedElectionsLength = async (isFinite) =>
    await ElectionFactory.methods.getDeployedElectionsLength(isFinite).call();

const makeNewVote = async (adminAddress,
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
    ).send({from: adminAddress});

module.exports = {
    getDeployedElections,
    getDeployedElectionsLength,
    makeNewVote
};
