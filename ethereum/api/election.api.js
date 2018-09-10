const web3 = require('../web3');
const Election = require('../election');
const Factory = require('../factory');
const timeUtil = require('../../util/time.util');

const electionState = {
    "0": "대기",
    "1": "진행 중",
    "2": "일시중지",
    "3": "집계 중",
    "4": "종료"
};

const isOwner = async (electionAddress, address) =>
    await Election(electionAddress).methods.isOwner(address).call();

const getOwner = async (electionAddress) =>
    await Election(electionAddress).methods.getOwner().call();

const isFiniteElection = async (electionAddress) =>
    await Election(electionAddress).methods.isFiniteElection().call();

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

const setElectionDescription = async (electionAddress, voterAddress, electionDescription) =>
    await Election(electionAddress).methods.setElectionDescription(electionDescription)
        .send({from: voterAddress, gas: 1000000});

const setElectionState = async (electionAddress, voterAddress, electionState) =>
    await Election(electionAddress).methods.setElectionState(electionState).send({from: voterAddress});

const setElectionDate = async (electionAddress, voterAddress, startDate, endDate) =>
    await Election(electionAddress).methods.setElectionDate(startDate, endDate)
        .send({from: voterAddress, gas: 1000000});

const setPublicKeyOfHe = async (electionAddress, voterAddress, publickKeyOfHe) =>
    await Election(electionAddress).methods.setPublicKeyOfHe(publickKeyOfHe).send({from: voterAddress});

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
    isFiniteElection,
    getBallotCount,
    getPublicKeyOfHe,
    getElectionSummary,
    setElectionDescription,
    setElectionState,
    setElectionDate,
    setPublicKeyOfHe,
    vote,
    // Custom Methods
    getElectionSummaryList
};
