const VoteFactory = artifacts.require("./VoteFactory.sol");
const Vote = artifacts.require("./Vote.sol");

contract('Voting + Voterlist', accounts => {
    let publicVoteInstance;

    before(async () => {
        const voteFactoryInstance = await VoteFactory.deployed();
        const deployedVotes = await voteFactoryInstance.getDeployedVotes.call(false);
        publicVoteInstance = await Vote.at(deployedVotes[0]);
    });

    it('계정 3이 후보자 1에게 투표', async () => {
        let account3VoterState = await publicVoteInstance.getVoterState(accounts[3]);
        assert.equal(parseInt(account3VoterState, 10), 0, '이미 투표한 상태');

        // 투표 메소드 실행
        await publicVoteInstance.voting(0, {from: accounts[3]});

        account3VoterState = await publicVoteInstance.getVoterState(accounts[3]);
        assert.equal(parseInt(account3VoterState, 10), 2, '투표가 안된 상태');

        const candidate1 = await publicVoteInstance.getCandidate.call(0);
        assert.equal(parseInt(candidate1[1], 10), 1, "투표가 안됨");

        const numVotedVoters = await publicVoteInstance.getNumVotedVoters.call();
        assert.equal(parseInt(numVotedVoters, 10), 1, "투표한 사람 목록에 포함되지 않음");
    });

    it('계정 4가 후보자 1에게 투표', async () => {
        await publicVoteInstance.voting(0, {from: accounts[4]});

        const candidate1 = await publicVoteInstance.getCandidate.call(0);
        assert.equal(parseInt(candidate1[1], 10), 2, "투표가 안됨");

        // 투표자 상태 확인
        let account4VoterState = await publicVoteInstance.getVoterState(accounts[4]);
        assert.equal(parseInt(account4VoterState, 10), 2, '투표가 안된 상태');

        const numVotedVoters = await publicVoteInstance.getNumVotedVoters.call();
        assert.equal(parseInt(numVotedVoters, 10), 2, "투표한 사람 목록에 포함되지 않음");
    });

    it('계정 5가 후보자 2에게 투표', async () => {
        await publicVoteInstance.voting(1, {from: accounts[5]});

        const candidate2 = await publicVoteInstance.getCandidate.call(1);
        assert.equal(parseInt(candidate2[1], 10), 1, "투표가 안됨");

        // 투표자 상태 확인
        let account5VoterState = await publicVoteInstance.getVoterState(accounts[5]);
        assert.equal(parseInt(account5VoterState, 10), 2, '투표가 안된 상태');

        const numVotedVoters = await publicVoteInstance.getNumVotedVoters.call();
        assert.equal(parseInt(numVotedVoters, 10), 3, "투표한 사람 목록에 포함되지 않음");
    });
});