const electionApi = require('../ethereum/api/election.api');
const candidateApi = require('../ethereum/api/candidate.api');
const voterApi = require('../ethereum/api/voter.api');

module.exports = {
    getElectionList: async (req, res) => {
        try {
            const electionSummaryList =
                await electionApi.getElectionSummaryList(req.originalUrl === '/finite');
            res.render('election/electionList', {
                isFinite: req.originalUrl === '/finite' ? 'finite' : 'public',
                electionList: electionSummaryList
            });
        } catch (err) {
            res.send(err.toString());
        }
    },
    getElectionDetail: async (req, res) => {
        const electionAddress = req.params.address;
        try {
            let electionDetail = {};

            electionDetail.summary = await electionApi.getElectionSummary(electionAddress);
            electionDetail.candidateList = await candidateApi.getCandidateList(electionAddress);
            electionDetail.ballotCount = await electionApi.getBallotCount(electionAddress);
            if (electionDetail.summary['electionState'] === "완료") {
                const candidateList = electionDetail.candidateList.slice(0);
                console.log(candidateList);
                candidateList.sort((a, b) => b[2] - a[2]);
                const max = candidateList['name'][2];
                electionDetail.resultName = [];
                for (let i = 0; i < candidateList.length; i++) {
                    if (candidateList[i][2] === max) electionDetail.resultName.push(candidateList[i][0]);
                }
            }
            if (req.user) {
                const voterAddress = req.user.etherAccount;
                electionDetail.voterState = await voterApi.getVoterState(electionAddress, voterAddress);
                const isOwner = await electionApi.isOwner(electionAddress, voterAddress);
                if (isOwner) electionDetail.owner = isOwner;
            }

            res.render('election/electionDetail', {
                electionDetail: electionDetail,
                path: req.path
            });
        } catch (err) {
            console.log(err);
            res.send(err.toString());
        }
    },
    postElectionState: async (req, res) => {

        if (!req.user) res.redirect('/login');

        const electionAddress = req.params.address;
        const voterAddress = req.user.etherAccount;

        try {
            const isVoteOwner = await electionApi.isOwner(electionAddress, voterAddress);
            if (isVoteOwner) {
                const state = req.body.state;
                await electionApi.setElectionState(electionAddress, voterAddress, state);
            } else {
                res.redirect('/login');
            }
            res.redirect(req.path);
        } catch (err) {
            res.send(err.toString());
        }
    },
    postElectionInformation: async (req, res) => {

        if (!req.user) res.redirect('/login');

        const electionAddress = req.params.address;
        const voterAddress = req.user.etherAccount;

        try {
            const isVoteOwner = await electionApi.isOwner(electionAddress, voterAddress);
            if (isVoteOwner) {

                const electionDescription = req.body.electionDescription;
                const startVoteDate = Date.parse(req.body.startDate) / 1000;
                const endVoteDate = Date.parse(req.body.endDate) / 1000;

                if (electionDescription)
                    await electionApi.setElectionDescription(electionAddress, voterAddress, electionDescription);
                if (startVoteDate && endVoteDate)
                    await electionApi.setElectionDate(
                        electionAddress, voterAddress, startVoteDate, endVoteDate);
            } else {
                res.redirect('/login');
            }
            res.redirect(req.path.substring(0, req.path.length - 7));
        } catch (err) {
            res.send(err.toString());
        }
    }
};
