const VoteFactory = artifacts.require("./VoteFactory.sol");
const Vote = artifacts.require("./Vote.sol");

contract('PublicVote', accounts => {
    let publicVoteInstance;
    let staticVoteName;
    let staticVoteSummary;

    before(async () => {
        const voteFactoryInstance = await VoteFactory.deployed();
        const deployedVotes = await voteFactoryInstance.getDeployedVotes.call(false);
        publicVoteInstance = await Vote.at(deployedVotes[0]);
    });

    it("투표가 퍼블릭인가?", async () => {
        let isPrivateVote = await publicVoteInstance.isPrivateVote.call();
        assert.ok(!isPrivateVote, "프리베이트로 나옴");
    });

    it("투표 정보 요약", async () => {
        let voteSummary = await publicVoteInstance.getVoteSummary.call();
        staticVoteName = voteSummary.splice(0, 1);
        console.log(voteSummary.map(item => parseInt(item, 10)));
        staticVoteSummary = voteSummary;
        assert.ok(voteSummary);
    });

    it("투표 이름 체크", async () => {
        assert.equal(staticVoteName, "테스트 퍼블릭 투표", "이름이 '테스트 퍼블릭 투표'가 아님");
    });

    it("투표 주인의 주소", async () => {
        let ownerAddress = await publicVoteInstance.owner.call();
        assert.equal(ownerAddress, accounts[1], accounts[1] + "이 아님!");
    });

    it("투표 상태 변환 테스트", async () => {
        await [1, 2, 3, 0].some(async (v) => {
            await publicVoteInstance.setVoteState(v, {from: accounts[1]});
            staticVoteSummary = await publicVoteInstance.getVoteSummary.call();
            const voteState = await parseInt(staticVoteSummary[1], 10);
            await assert.equal(voteState, v, v + "로 안바뀜!!!");
        });
    });

    it("투표 날짜 변환 테스트", async () => {
        // 시작일 : 오늘, 끝일 : 일주일 후
        const now = new Date().getTime();
        const afterWeek = now+1000*60*24*7;
        await publicVoteInstance.setDate(now, afterWeek, {from: accounts[1]});

        staticVoteSummary = await publicVoteInstance.getVoteSummary.call();
        const voteStartDate = await parseInt(staticVoteSummary[2], 10);
        const voteEndDate = await parseInt(staticVoteSummary[3], 10);

        assert.equal(voteStartDate, now, now + "로 안바뀜");
        assert.equal(voteEndDate, afterWeek, afterWeek + "로 안바뀜");
    })
});

contract('PrivateVote', accounts => {
    let privateVoteInstance;
    let staticVoteName;
    let staticVoteSummary;

    before(async () => {
        const voteFactoryInstance = await VoteFactory.deployed();
        const deployedVotes = await voteFactoryInstance.getDeployedVotes.call(true);
        privateVoteInstance = await Vote.at(deployedVotes[0]);
    });

    it("투표 정보 요약", async () => {
        let voteSummary = await privateVoteInstance.getVoteSummary.call();
        staticVoteName = voteSummary.splice(0, 1);
        console.log(voteSummary.map(item => parseInt(item, 10)));
        staticVoteSummary = voteSummary;
        assert.ok(voteSummary);
    });

    it("투표 이름 체크", async () => {
        assert.equal(staticVoteName, "테스트 프리베이트 투표", "이름이 '테스트 프리베이트 투표'가 아님");
    });

    it("투표가 프라이빗인가?", async () => {
        let isPrivateVote = await privateVoteInstance.isPrivateVote.call();
        assert.ok(isPrivateVote, "퍼블릭으로 나옴");
    });

    it("투표 주인의 주소", async () => {
        let ownerAddress = await privateVoteInstance.owner.call();
        assert.equal(ownerAddress, accounts[2], accounts[2] + "이 아님!");
    });
});