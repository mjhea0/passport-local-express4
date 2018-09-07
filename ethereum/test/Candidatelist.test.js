const VoteFactory = artifacts.require("./VoteFactory.sol");
const Vote = artifacts.require("./Vote.sol");

contract('Candidatelist', accounts => {
    let privateVoteInstance;

    const candidateListAtContract = async length => {
        for(let i = 0; i < length; i++) {
            const candidateInfo = await privateVoteInstance.getCandidate.call(i);
            console.log(candidateInfo);
        }
    };

    before(async () => {
        const voteFactoryInstance = await VoteFactory.deployed();
        const deployedVotes = await voteFactoryInstance.getDeployedVotes.call(true);
        privateVoteInstance = await Vote.at(deployedVotes[0]);
    });

    it('후보자 5명 추가', async () => {
        const candidateList = ["아무개", "홍길동", "배민수", "한상우", "북극곰"];
        for(let i = 0; i < candidateList.length; i++) {
            await privateVoteInstance.addCandidate(candidateList[i], {from: accounts[2]});
        }
    });

    it('후보자 목록 확인', async () => {
        let candidateLength = await privateVoteInstance.getCandidateLength.call();
        candidateLength = parseInt(candidateLength, 10);
        assert.equal(candidateLength, 9, candidateLength + "밖에 추가가 되어 있음..");

        await candidateListAtContract(candidateLength);
    });

    it('후보자 "홍길동", "배민수" 제거', async () => {
        await privateVoteInstance.removeCandidate(5, {from: accounts[2]});
        await privateVoteInstance.removeCandidate(5, {from: accounts[2]});

        let candidateLength = await privateVoteInstance.getCandidateLength.call();
        candidateLength = parseInt(candidateLength, 10);
        assert.equal(candidateLength, 7, candidateLength + " : 길이가 맞지 않음");
        await candidateListAtContract(candidateLength);
    });
});
