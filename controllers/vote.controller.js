const fs = require('fs');
const path = require('path');
const electionApi = require('../ethereum/api/election.api');
const candidateApi = require('../ethereum/api/candidate.api');
const voterApi = require('../ethereum/api/voter.api');
const Account = require('../mongo/models/account');
const hec = require('../hec/hec.api');
const ipfs = require('../ipfs/ipfs');
const mkdirSync = require('../util/fs.util').mkdirSync;

module.exports = {
    getVote: async (req, res) => {

        if (!req.user) res.redirect('/login');

        try {
            const electionAddress = req.params.address;
            const voterAddress = req.user.etherAccount;

            let electionDetail = {};
            electionDetail.summary = await electionApi.getElectionSummary(electionAddress);
            const voterState = await voterApi.getVoterState(electionAddress, voterAddress);

            const candidateListPath = path.resolve(`./hec/data/candidate/${electionAddress}/${voterAddress}`);
            if (voterState !== "Voted") {
                electionDetail.candidateList = await candidateApi.getCandidateList(electionAddress);
                if (fs.existsSync(candidateListPath)) {
                    const candidateListAtFile = fs.readFileSync(candidateListPath).toString();
                    const candidateList = candidateListAtFile.split(',');
                    return res.render('election/vote', {
                        electionDetail: electionDetail,
                        candidateList: candidateList,
                        path: req.path
                    });
                }
                const total = electionDetail.candidateList.length;
                await hec.encryptCandidateList(electionAddress, voterAddress,
                    total, 'hec/data', (out, err) => {
                        if (err) console.error(err);
                        console.log(out);

                        // fileList 만들고
                        let fileList = [];
                        for (let i = 0; i < total; i++) {
                            const filePath = path.resolve(
                                `./hec/data/candidate/${electionAddress.toLowerCase()}-${i}-${voterAddress.toLowerCase()}.txt`);
                            fileList.push({
                                path: filePath,
                                content: new Buffer.from(fs.readFileSync(filePath))
                            });
                        }

                        // IPFS에 저장
                        return ipfs.files.add(fileList, (err, files) => {
                            if (err) {
                                console.error(err);
                                return res.send('error');
                            }

                            let candidateList = [];
                            for (let i = 0; i < total; i++) {
                                candidateList[i] = files[i].hash;
                            }

                            // 파일 저장
                            mkdirSync(path.resolve(`./hec/data/candidate/${electionAddress}`));
                            fs.writeFileSync(candidateListPath, candidateList.toString());

                            return res.render('election/vote', {
                                electionDetail: electionDetail,
                                candidateList: candidateList,
                                path: req.path
                            });
                        });
                    });
            } else {
                res.redirect(req.path.substring(0, req.path.length - 5));
            }
        } catch (err) {
            res.send(err.toString());
        }
    },
    postVote:
        async (req, res) => {

            if (!req.user) {
                res.redirect('/login');
            }

            try {
                const electionAddress = req.params.address;
                const voterAddress = req.user.etherAccount;
                const candidate = req.body.candidate;

                // 현재 투표 상태
                let voterState = await voterApi.getVoterState(electionAddress, voterAddress);
                if (voterState !== "Voted") {
                    // 투표완료 상태가 아니면

                    // 컨트렉트에 투표 요청을 보냄
                    await electionApi.vote(electionAddress, voterAddress, candidate);

                    // 다시 투표 상태를 확인하여
                    voterState = await voterApi.getVoterState(electionAddress, voterAddress);
                    if (voterState === "Voted") {
                        // 투표 완료 상태가 되면

                        const candidateListPath = path.resolve(
                            `./hec/data/candidate/${electionAddress}/${voterAddress}`);

                        // 파일 내용 삭제
                        fs.writeFileSync(candidateListPath, "");

                        // DB 업데이트
                        Account.findOneAndUpdate({username: req.user.username}, {
                            $push: {votingVotes: electionAddress}
                        }, {upsert: true}, (err, data) => {
                            if (err) res.send(err.toString());
                            else res.redirect(req.path.substring(0, req.path.length - 5));
                        });
                    } else {
                        res.send('투표 실패');
                    }
                } else {
                    alert("이미 참여하신 투표입니다.");
                }
            } catch (err) {
                res.send(err.toString());
            }
        }
};
