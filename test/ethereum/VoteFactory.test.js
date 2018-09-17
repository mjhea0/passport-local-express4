const VoteFactory = artifacts.require('./VoteFactory.sol');

contract('VoteFactory', accounts => {
  let voteFactoryInstance;

  before(() => {
    VoteFactory.deployed().then((instance) =>
      voteFactoryInstance = instance
    );
  });

  it('퍼블릭 투표 하나 생성', async () => {
    await voteFactoryInstance.makeNewVote('테스트 퍼블릭 투표', '0x7117cDeFC3C444e4A5D00d841A24B15a983360A6', 0, 0, false);
    let deployedVotes = await voteFactoryInstance.getDeployedVotes.call(true);
    assert.ok(deployedVotes[0], '생성 안됨');
  });

  it('프라이빗 투표 하나 생성', async () => {
    await voteFactoryInstance.makeNewVote('테스트 프라이빗 투표', '0x9F284E80a68ccb956224Fa2D75d950bcBAdB7C0a', 0, 0, true);
    let deployedVotes = await voteFactoryInstance.getDeployedVotes.call(false);
    assert.ok(deployedVotes[0], '생성 안됨');
  });

  it('2개 이상 생성됐는지 확인 : getDeployedVotes', async () => {
    let deployedPublicVotes = await voteFactoryInstance.getDeployedVotes.call(false);
    let deployedPrivateVotes = await voteFactoryInstance.getDeployedVotes.call(true);
    await console.log(deployedPublicVotes + ', ' + deployedPrivateVotes);
    await assert.ok(deployedPublicVotes, '작동 안했음');
    await assert.ok(deployedPrivateVotes, '작동 안했음');
    await assert.equal(deployedPublicVotes.length + deployedPrivateVotes.length, 4, '2개 생성 안됨');
  });

  it('다른 계정이 실행하면 오류', async () => {
    try {
      await voteFactoryInstance.makeNewVote('권한 오류 테스트', '0x9F284E80a68ccb956224Fa2D75d950bcBAdB7C0a', 0, 0, true, {from: accounts[1]});
    } catch (err) {
      let deployedPublicVotes = await voteFactoryInstance.getDeployedVotes.call(false);
      let deployedPrivateVotes = await voteFactoryInstance.getDeployedVotes.call(true);
      await assert.equal(deployedPrivateVotes.length + deployedPublicVotes.length,
        4, '생성되면 안되는건데 생성이 되는데?');
    }
  });
});
