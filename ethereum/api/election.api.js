const web3 = require('../web3');
const Election = require('../election');
const Factory = require('../factory');
const timeUtil = require('../../util/time.util');

const electionState = {
    "0": "대기",
    "1": "진행 중",
    "2": "일시중지",
    "3": "종료"
};

const isOwner = async (electionAddress, address) =>
    await Election(electionAddress).methods.isOwner(address).call();

const getOwner = async (electionAddress) =>
    await Election(electionAddress).methods.getOwner().call();

const getElectionState = async (electionAddress) =>
    await Election(electionAddress).methods.getElectionState().call();

const isFiniteElection = async (electionAddress) =>
    await Election(electionAddress).methods.isFiniteElection().call();

const getTallyResult = async (electionAddress) =>
    await Election(electionAddress).methods.getTallyResult().call();

const getBallot = async (electionAddress, voterAddress) =>
    await Election(electionAddress).methods.getBallot(voterAddress).call();

const getBallotCount = async (electionAddress) =>
    await Election(electionAddress).methods.getBallotCount().call();

const getPublicKeyOfHe = async (electionAddress) =>
    await Election(electionAddress).methods.getPublicKeyOfHe().call();

const getElectionSummary = async (electionAddress) => {
    const rawSummary = await Election(electionAddress).methods.getElectionSummary().call();
    const startDate = timeUtil.timestampToDate(rawSummary['3']);
    const endDate = timeUtil.timestampToDate(rawSummary['4']);
    return await {
        electionName: rawSummary['0'],
        electionDescription: rawSummary['1'],
        electionState: electionState[rawSummary['2']],
        electionAddress: electionAddress,
        startDate: startDate,
        endDate: endDate,
        showDate: `${startDate} - ${endDate}`,
        ballotCount: rawSummary['5'],
        finiteElection: rawSummary['6']
    };
};

const setElectionDescription = async (electionAddress, ownerAddress, electionDescription) =>
    await Election(electionAddress).methods.setElectionDescription(electionDescription)
        .send({from: ownerAddress, gas: 1000000});

const setElectionState = async (electionAddress, ownerAddress, electionState) =>
    await Election(electionAddress).methods.setElectionState(electionState)
        .send({from: ownerAddress, gas: 1000000});

const setElectionDate = async (electionAddress, ownerAddress, startDate, endDate) =>
    await Election(electionAddress).methods.setElectionDate(startDate, endDate)
        .send({from: ownerAddress, gas: 1000000});

const setPublicKeyOfHe = async (electionAddress, ownerAddress, publicKeyOfHe) =>
    await Election(electionAddress).methods.setPublicKeyOfHe(publicKeyOfHe)
        .send({from: ownerAddress, gas: 1000000});

const setTallyResult = async (electionAddress, ownerAddress, tallyResult) =>
    await Election(electionAddress).methods.setTallyResult(tallyResult)
        .send({from: ownerAddress, gas: 1000000});

const vote = async (electionAddress, voterAddress, candidateHash) => {
    const ownerAddress = await Election(electionAddress).methods.getOwner().call();
    // console.log(ownerAddress);
    return await Election(electionAddress).methods.vote(voterAddress, candidateHash)
        .send({from: ownerAddress, gas: 1000000});
};

const getElectionSummaryList = async (isFiniteElection) => {
    const electionAddressList = await Factory.methods.getDeployedElections(isFiniteElection).call();
    const electionSummaryList = await electionAddressList.map(
        async (electionAddress) => await getElectionSummary(electionAddress));
    return await Promise.all(electionSummaryList);
};

module.exports = {
    // Contract Methods
    isOwner,
    getOwner,
    getElectionState,
    isFiniteElection,
    getTallyResult,
    getBallot,
    getBallotCount,
    getPublicKeyOfHe,
    getElectionSummary,
    setElectionDescription,
    setElectionState,
    setElectionDate,
    setPublicKeyOfHe,
    setTallyResult,
    vote,
    // Custom Methods
    getElectionSummaryList
};
