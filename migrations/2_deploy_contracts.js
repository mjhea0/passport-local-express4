const fs = require('fs');
const timeUtil = require('../util/time.util');
const VoteFactory = artifacts.require('./VoteFactory.sol');
const Vote = artifacts.require('./Vote.sol');

module.exports = (deployer, network, accounts) =>
    deployer.then(async () => {
        await deployer.deploy(VoteFactory);
        const deployedVoteFactory = await VoteFactory.deployed();

        await deployedVoteFactory.makeNewVote(
            '6.13 대전 지방선거',
            '이번 선거에서 선출된 공직자의 임기는 4년(2018. 7. 1.~2022. 6. 30.)이며, 재보궐선거의 경우 전임자의 잔여임기(~2020. 5. 29.)까지 업무를 수행하게 된다.',
            accounts[1],
            timeUtil.dateStringToTimestamp('06/13/2018 06:00:00'),
            timeUtil.dateStringToTimestamp('06/13/2018 18:00:00'),
            false);
        await deployedVoteFactory.makeNewVote(
            '한밭대학교 총학생회장 선거',
            '2018년도 총학생회장 선거를 개최합니다. \n' +
            '총학생회는 학생들의 자율적인 의사에 따라 이루어진 자치기구로서 자주 학원건설의 길로 새로운 시작의 발걸음을 시작할 것입니다. \n' +
            '작은 발걸음부터 시작하지만 그 작은 약속을 가장 소중히 생각하며 새로운 희망의 씨를 뿌리는 자주학원 건설을 위한 총학생회를 만들 것입니다.',
            accounts[2],
            timeUtil.dateStringToTimestamp('11/11/2018 08:30:00'),
            timeUtil.dateStringToTimestamp('11/13/2018 22:00:00'),
            false
        );

        const deployedPublicVotes = await deployedVoteFactory.getDeployedVotes.call(false);
        // const deployedQkxeoVotes = await deployedVoteFactory.getDeployedVotes.call(false);
        console.log('지방선거 : ' + deployedPublicVotes[0]);
        console.log('밭대선거 : ' + deployedPublicVotes[1]);

        // 지방선거 투표에 후보자 추가
        const deployedPublicVote = await Vote.at(deployedPublicVotes[0]);
        const candidateList = ['허태정', '박성효', '남충희', '김윤기'];
        const candidateCommitment = [
            'http://policy.nec.go.kr/skin/doc.html?fn=20180602153429870_1.pdf&rs=/preview/html/201806/',
            'http://policy.nec.go.kr/skin/doc.html?fn=20180601163602545_1.pdf&rs=/preview/html/201806/',
            'http://policy.nec.go.kr/skin/doc.html?fn=20180603213658679_1.pdf&rs=/preview/html/201806/',
            'http://policy.nec.go.kr/skin/doc.html?fn=20180601163653030_1.pdf&rs=/preview/html/201806/'
        ];
        for (let i = 0; i < candidateList.length; i++) {
            await deployedPublicVote.addCandidate(
                candidateList[i],
                candidateCommitment[i],
                {from: accounts[1]}
            );
            // const addedCandidate = await deployedPublicVote.getCandidate.call(i);
            // await console.log(addedCandidate);
        }

        // 한밭대선거 투표에 후보자 추가
        const deployedPrivateVote = await Vote.at(deployedPublicVotes[1]);
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
                {from: accounts[2]}
            );
            // const addedCandidate2 = await deployedPrivateVote.getCandidate.call(i);
            // await console.log(addedCandidate2);
        }

        // 파일에 저장
        await fs.open('./config/contract-address.json', 'w', (err, fd) => {
            if (err) throw 'error opening file: ' + err;
            const jsonObj = {
                factory: deployedVoteFactory.address,
                test_wlqkd_contract: deployedPublicVotes[0],
                test_qkxeo_contract: deployedPublicVotes[1],
                test_wlqkd_address: accounts[1],
                test_qkxeo_address: accounts[2]
            };
            fs.writeFile('./config/contract-address.json', new Buffer.from(JSON.stringify(jsonObj)), 'utf8', (err) => {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, () => console.log(JSON.stringify(jsonObj)));
            });
        });
    });
