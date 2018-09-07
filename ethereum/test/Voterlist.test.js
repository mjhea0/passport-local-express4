const VoteFactory = artifacts.require("./VoteFactory.sol");
const Vote = artifacts.require("./Vote.sol");

contract('Voterlist + Voting', accounts => {
    let privateVoteInstance;

    before(async () => {
        const voteFactoryInstance = await VoteFactory.deployed();
        const deployedVotes = await voteFactoryInstance.getDeployedVotes.call(true);
        privateVoteInstance = await Vote.at(deployedVotes[0]);
    });

    it('현재 투표자들은 0명', async () => {
        const numVoters = await privateVoteInstance.getNumVoters();
        assert.equal(parseInt(numVoters, 10), 0, "투표자가 0명이 아님");
    });

    it('투표자 3명 추가', async () => {
        for (let i = 3; i < 6; i++) {
            await privateVoteInstance.addVoterToVoterlist(accounts[i], {from: accounts[2]});

            // 각 투표자 상태 체크
            const voterState = await privateVoteInstance.getVoterState(accounts[i]);
            assert.equal(parseInt(voterState, 10), 1, "Voteable로 안바뀜!!");
        }

        // 투표자 수 체크
        const numVoters = await privateVoteInstance.getNumVoters();
        assert.equal(parseInt(numVoters, 10), 3, "투표자가 3명이 아님");
    });

    it('투표자 1명(계정 4) 삭제', async () => {
        await privateVoteInstance.setVoterStateNoneFromVoters(accounts[4], {from: accounts[2]});

        // 투표자 상태 체크
        const voterState = await privateVoteInstance.getVoterState(accounts[4]);
        assert.equal(parseInt(voterState, 10), 0, "None으로 안바뀜!!");

        // 투표자 수 체크
        const numVoters = await privateVoteInstance.getNumVoters();
        assert.equal(parseInt(numVoters, 10), 2, "투표자 수가 안바뀜");
    });

    it('계정 4가 후보자 1에 투표', async () => {
        try {
            await privateVoteInstance.voting(0, {from: accounts[4]});
            assert.ok(false);
        } catch (e) {
            assert.ok(e);
        }

        // 후보자 정보 확인
        const candidate1 = await privateVoteInstance.getCandidate.call(0);
        assert.equal(parseInt(candidate1[1], 10), 0, "투표가 되버림!!");

        // 투표자 상태 확인
        let account4VoterState = await privateVoteInstance.getVoterState(accounts[4]);
        assert.equal(parseInt(account4VoterState, 10), 0, '투표가 된 상태가 되버림!!!!');

        // 투표한 사람 목록에 추가되었는지 확인
        const numVotedVoters = await privateVoteInstance.getNumVotedVoters.call();
        assert.equal(parseInt(numVotedVoters, 10), 0, "투표한 사람 목록에 포함됨!");
    });

    it('계정 3이 후보자1에 투표', async () => {
        let account3VoterState = await privateVoteInstance.getVoterState(accounts[3]);
        assert.equal(parseInt(account3VoterState, 10), 1, '투표자로 등록이 안됨');

        // 투표 메소드 실행
        await privateVoteInstance.voting(0, {from: accounts[3]});

        account3VoterState = await privateVoteInstance.getVoterState(accounts[3]);
        assert.equal(parseInt(account3VoterState, 10), 2, '투표가 안된 상태');

        // 후보자 정보 확인
        const candidate1 = await privateVoteInstance.getCandidate.call(0);
        assert.equal(parseInt(candidate1[1], 10), 1, "투표가 안됨");

        // 투표한 사람 목록에 추가되었는지 확인
        const numVotedVoters = await privateVoteInstance.getNumVotedVoters.call();
        assert.equal(parseInt(numVotedVoters, 10), 1, "투표한 사람 목록에 포함되지 않음");

        const numVoters = await privateVoteInstance.getNumVoters.call();
        assert.equal(parseInt(numVoters, 10), 2, "투표자 명단이 줄어들음(줄어들면 안됨)");
    });
});