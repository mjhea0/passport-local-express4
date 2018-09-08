const fs = require('fs');
const timeUtil = require('../../util/time.util');
const ElectionFactory = artifacts.require('./ElectionFactory.sol');
const Election = artifacts.require('./Election.sol');
const hec = require('../../hec/hec');
const ipfs = require('../../ipfs/ipfs');

module.exports = (deployer, network, accounts) =>
    deployer.then(async () => {
        await deployer.deploy(ElectionFactory);
        const deployedVoteFactory = await ElectionFactory.deployed();

        const deployedPublicVotes = await deployedVoteFactory.getDeployedElections.call(false);
        // const deployedQkxeoVotes = await deployedVoteFactory.getDeployedVotes.call(false);
        console.log('밭대선거 : ' + deployedPublicVotes[0]);

        // 한밭대선거 투표에 후보자 추가
        const deployedPrivateVote = await Election.at(deployedPublicVotes[0]);
        const privateCandidateList = ['악센트', '라우드', '비포유'];
        const privateCandidateCommitment = [
            'https://www.facebook.com/496324237400491/photos/pcb.500330310333217/500330110333237/?type=3&theater',
            'https://www.facebook.com/348577105502407/photos/pcb.348811022145682/348810525479065/?type=3&theater',
            'https://www.facebook.com/beforu.hanbat/photos/a.1099073166799222.1073741828.1099070860132786/1100406446665894/?type=3&theater'
        ];
        for (let i = 0; i < privateCandidateList.length; i++) {
            await deployedPrivateVote.addCandidate(
                privateCandidateList[i],
                privateCandidateCommitment[i],
                {from: accounts[1]}
            );
            // const addedCandidate2 = await deployedPrivateVote.getCandidate.call(i);
            // await console.log(addedCandidate2);
        }

        // 파일에 저장
        await fs.open('./config/contract-address.json', 'w', (err, fd) => {
            if (err) throw 'error opening file: ' + err;
            const jsonObj = {
                factory: deployedVoteFactory.address,
                test_qkxeo_contract: deployedPublicVotes[0],
                test_qkxeo_address: accounts[1]
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
                console.log("good. file saved");
            } else {
                console.error("failed: file size 0");
            }
        });
        // 이후 다른 스크립트로 IPFS를 실행하면 됩니다.
    });
