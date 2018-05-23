const fs = require('fs');
const VoteFactory = artifacts.require('./VoteFactory.sol');
const Vote = artifacts.require('./Vote.sol');

module.exports = (deployer, network, accounts) =>
  deployer.then(async () => {
    await deployer.deploy(VoteFactory);
    const deployedVoteFactory = await VoteFactory.deployed();

    await deployedVoteFactory.makeNewVote('테스트 퍼블릭 투표', accounts[1], 0, new Date().getTime() + 43200000, false);
    await deployedVoteFactory.makeNewVote(
      '테스트 프라이빗 투표',
      accounts[2],
      0,
      new Date().getTime() + 43200000,
      true
    );

    const deployedPublicVotes = await deployedVoteFactory.getDeployedVotes.call(false);
    const deployedPrivateVotes = await deployedVoteFactory.getDeployedVotes.call(true);
    // console.log('퍼블릭 : ' + deployedPublicVotes);
    // console.log('프라이빗 : ' + deployedPrivateVotes);

    // 퍼블릭 투표에 후보자 추가
    const deployedPublicVote = await Vote.at(deployedPublicVotes[0]);
    const candidateList = ['하나', '둘', '셋', '넷'];
    for (let i = 0; i < candidateList.length; i++) {
      await deployedPublicVote.addCandidate(candidateList[i], {from: accounts[1]});
      // const addedCandidate = await deployedPublicVote.getCandidate.call(i);
      // await console.log(addedCandidate);
    }

    // 프라이빗 투표에 후보자 추가
    const deployedPrivateVote = await Vote.at(deployedPrivateVotes[0]);
    const privateCandidateList = ['일', '이', '삼', '사'];
    for (let i = 0; i < privateCandidateList.length; i++) {
      await deployedPrivateVote.addCandidate(privateCandidateList[i], {from: accounts[2]});
      // const addedCandidate2 = await deployedPrivateVote.getCandidate.call(i);
      // await console.log(addedCandidate2);
    }

    // 파일에 저장
    await fs.open('./config/contract-address.json', 'w', (err, fd) => {
      if (err) throw 'error opening file: ' + err;
      const jsonObj = {
        factory: deployedVoteFactory.address,
        test_public: deployedPublicVotes[0],
        test_private: deployedPrivateVotes[0]
      };
      fs.writeFile('./config/contract-address.json', new Buffer.from(JSON.stringify(jsonObj)), 'utf8', (err) => {
        if (err) throw 'error writing file: ' + err;
        fs.close(fd, () => console.log(JSON.stringify(jsonObj)));
      });
    });
  });
