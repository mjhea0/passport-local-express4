const fs = require('fs');
const timeUtil = require('../../util/time.util');
const ElectionFactory = artifacts.require('./ElectionFactory.sol');
const Election = artifacts.require('./Election.sol');
const hec = require('../../hec/hec.api.js');

module.exports = (deployer, network, accounts) =>
    deployer.then(async () => {
        await deployer.deploy(ElectionFactory);
        const deployedElectionFactory = await ElectionFactory.deployed();

        await deployedElectionFactory.makeNewElection(
            '6.13 대전 지방선거',
            '이번 선거에서 선출된 공직자의 임기는 4년(2018. 7. 1.~2022. 6. 30.)이며, 재보궐선거의 경우 전임자의 잔여임기(~2020. 5. 29.)까지 업무를 수행하게 된다.',
            accounts[1],
            timeUtil.dateStringToTimestamp('09/10/2018 06:00:00'),
            timeUtil.dateStringToTimestamp('10/10/2018 18:00:00'),
            false);

        const deployedPublicElections = await deployedElectionFactory.getDeployedElections.call(false);
        console.log('지방선거 : ' + deployedPublicElections[0]);

        // 지방선거 투표에 후보자 추가
        const deployedRegionElection = await Election.at(deployedPublicElections[0]);
        const regionCandidateList = ['허태정', '박성효', '남충희', '김윤기'];
        const regionCandidateCommitment = [
            'http://policy.nec.go.kr/skin/doc.html?fn=20180602153429870_1.pdf&rs=/preview/html/201806/',
            'http://policy.nec.go.kr/skin/doc.html?fn=20180601163602545_1.pdf&rs=/preview/html/201806/',
            'http://policy.nec.go.kr/skin/doc.html?fn=20180603213658679_1.pdf&rs=/preview/html/201806/',
            'http://policy.nec.go.kr/skin/doc.html?fn=20180601163653030_1.pdf&rs=/preview/html/201806/'
        ];
        for (let i = 0; i < regionCandidateList.length; i++) {
            await deployedRegionElection.addCandidate(
                regionCandidateList[i],
                regionCandidateCommitment[i],
                {from: accounts[1]}
            );
        }

        // 파일에 저장
        await fs.open('./config/contract-address.json', 'w', (err, fd) => {
            if (err) throw 'error opening file: ' + err;
            const jsonObj = {
                factory: deployedElectionFactory.address,
                test_region_contract: deployedPublicElections[0],
                test_region_address: accounts[1]
            };
            fs.writeFile('./config/contract-address.json',
                new Buffer.from(JSON.stringify(jsonObj)), 'utf8', (err) => {
                    if (err) throw 'error writing file: ' + err;
                    fs.close(fd, () => console.log(JSON.stringify(jsonObj)));
                });
        });

        // hec으로 공개키를 저장합니다.
        await hec.createKeys(deployedPublicElections[0], 10007, 7, 'hec/data', async () => {
            const publicKeyFilePath = "./hec/data/publicKey/" + deployedPublicElections[0] + ".bin";
            const fileSize = fs.statSync(publicKeyFilePath).size;
            if (fileSize > 0) {
                console.log("good. Key files saved");
            } else {
                console.error("failed: file not Saved");
            }
        });
        // 이후 다른 스크립트로 IPFS를 실행하면 됩니다.
    });
