const fs = require('fs');
const electionApi = require('../ethereum/api/election.api');
const candidateApi = require('../ethereum/api/candidate.api');
const voterApi = require('../ethereum/api/voter.api');
const Account = require('../mongo/models/account');
const hecIpfsApi = require('../api/hec.ipfs.api');
const hec = require('../hec/hec.api');

module.exports = {
    getVote: async (req, res) => {

        if (!req.user) res.redirect('/login');

        try {
            const electionAddress = req.params.address;
            const voterAddress = req.user.etherAccount;

            let electionDetail = {};
            electionDetail.summary = await electionApi.getElectionSummary(electionAddress);
            const voterState = await voterApi.getVoterState(electionAddress, voterAddress);
            if (voterState !== "Voted") {
                electionDetail.candidateList = await candidateApi.getCandidateList(electionAddress);

                const total = electionDetail.candidateList.length;
                await hec.encryptCandidateList(electionAddress, voterAddress,
                    total, 'hec/data', (out, err) => {
                        if(err) console.error(err);
                        console.log(out);

                        // fileList 만들고
                        let fileList = [];
                        for (let i = 0; i < total; i++) {
                            const path = './hec/data/candidate';
                            fileList.push({
                                path: path,
                                content: new Buffer.from(
                                    `${path}/${electionAddress}-${i}-${voterAddress}.txt`)
                            });
                        }

                        // IPFS에 저장
                        return ipfs.files.add(fileList, (err, res) => {
                            console.log(res);
                            // 파일 저장
                            const byte = fs.writeFileSync(
                                `./hec/data/candidate/${electionAddress}/${voterAddress}`, res.toString());
                            if(byte > 0) {
                                console.log("good!!");
                            } else {
                                console.log("error!");
                            }
                            res.render('election/vote', {
                                electionDetail: electionDetail,
                                candidateList: res,
                                path: req.path
                            });
                        });
                    });
                // 후보자 hash 리스트
                // await hecIpfsApi.makeEncryptCandidateList(
                //     electionAddress,
                //     voterAddress,
                //     electionDetail.candidateList.length,
                //     '/home/ssangwoo/prototype/hec/data', (err, out) => {
                //         if(err) console.log(err);
                //         console.log(out);
                //
                //     const content = fs.readFileSync(`./hec/data/candidate/${electionAddress}/${voterAddress}`);
                //     electionDetail.candidateHashList = content.slice(',');
                //
                //      res.render('election/vote', {
                //         	electionDetail: electionDetail,
                //        		path: req.path
                // 	});
            } else {
                res.redirect(req.path.substring(0, req.path.length - 5));
            }
        } catch (err) {
            res.send(err.toString());
        }
    },
    postVote: async (req, res) => {

        if (!req.user) {
            res.redirect('/login');
        }

        try {
            const electionAddress = req.params.address;
            const voterAddress = req.user.etherAccount;
            const candidate = req.body.candidate;

            let voterState = await voterApi.getVoterState(electionAddress, voterAddress);
            if (voterState !== "Voted") {
                await electionApi.vote(electionAddress, voterAddress, candidate);
                voterState = await voterApi.getVoterState(electionAddress, voterAddress);
                if (voterState === "Voted") {
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
