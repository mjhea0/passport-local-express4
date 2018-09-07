const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const voteService = require('../services/election.service');
const candidateService = require('../services/candidate.service');
const voterService = require('../services/voter.service');

/* GET users listing. */
router.get('/:vote(public|private)', async (req, res) => {
    try {
        const voteSummaryList = await voteService.getVoteList(req.originalUrl === '/private');
        res.render('vote/voteList', {
            isPrivate: req.originalUrl === '/private' ? 'private' : 'public',
            vote: voteSummaryList
        });
    } catch (err) {
        res.send(err.toString());
    }
});

router.get('/:vote(public|private)/:address', async (req, res) => {
    const voteAddress = req.params.address;

    try {
        let voteDetail = {};

        voteDetail.summary = await voteService.voteSummary(voteAddress);
        voteDetail.candidateList = await candidateService.getCandidateList(voteAddress);
        voteDetail.voterNumber = await voteService.getNumVotedVoters(voteAddress);
        if (voteDetail.summary[2] === '3') {
            const candidateList = voteDetail.candidateList.slice(0);
            candidateList.sort((a, b) => b[2] - a[2]);
            const max = candidateList[0][2];
            voteDetail.resultName = [];
            for (let i = 0; i < candidateList.length; i++) {
                if (candidateList[i][2] === max) voteDetail.resultName.push(candidateList[i][0]);
            }
        }
        if (req.user) {
            const voterAddress = req.user.etherAccount;
            voteDetail.voterState = await voterService.getVoterState(voteAddress, voterAddress);
            const isOwner = await voterService.isOwner(voteAddress, voterAddress);
            if (isOwner) voteDetail.owner = isOwner;
        }

        res.render('vote/voteDetail', {
            voteDetail: voteDetail,
            path: req.path
        });
    } catch (err) {
        res.send(err.toString());
    }
});

router.post('/:vote(public|private)/:address', async (req, res) => {

    if (!req.user) res.redirect('/login');

    try {
        const voteAddress = req.params.address;
        const voterAddress = req.user.etherAccount;
        const state = req.body.state;

        const isVoteOwner = await voterService.isOwner(voteAddress, voterAddress);
        if (isVoteOwner) {
            await voteService.setVoteState(voteAddress, voterAddress, state);
        }
        res.redirect(req.path);
    } catch (err) {
        res.send(err.toString());
    }
});

router.post('/:vote(public|private)/:address/modify', async (req, res) => {

    if (!req.user) res.redirect('/login');

    try {
        const voteAddress = req.params.address;
        const voterAddress = req.user.etherAccount;

        const voteDescription = req.body.voteDescription;
        const startVoteDate = Date.parse(req.body.startDate) / 1000;
        const endVoteDate = Date.parse(req.body.endDate) / 1000;

        const isVoteOwner = await voterService.isOwner(voteAddress, voterAddress);
        if (isVoteOwner) {
            if (voteDescription)
                await voteService.setVoteDescription(voteAddress, voterAddress, voteDescription);
            if (startVoteDate && endVoteDate)
                await voteService.setVoteDate(
                    voteAddress, voterAddress, startVoteDate, endVoteDate);
        }
        res.redirect(req.path.substring(0, req.path.length - 7));
    } catch (err) {
        res.send(err.toString());
    }
});

router.get('/:vote(public|private)/:address/vote', async (req, res) => {

    if (!req.user) res.redirect('/login');

    try {
        const voteAddress = req.params.address;
        const voterAddress = req.user.etherAccount;
        let voteDetail = {};

        voteDetail.summary = await voteService.voteSummary(voteAddress);
        const voteState = await voterService.getVoterState(voteAddress, voterAddress);
        if (voteState !== '2') {
            voteDetail.candidateList = await candidateService.getCandidateList(voteAddress);
            res.render('vote/vote', {
                voteDetail: voteDetail,
                path: req.path
            });
        } else {
            res.redirect(req.path.substring(0, req.path.length - 5));
        }
    } catch (err) {
        res.send(err.toString());
    }
});

router.post('/:vote(public|private)/:address/vote', async (req, res) => {

    if (!req.user) {
        res.redirect('/login');
    }

    try {
        const voteAddress = req.params.address;
        const voterAddress = req.user.etherAccount;
        const candidate = req.body.candidate;

        let state = await voterService.getVoterState(voteAddress, voterAddress);
        if (state !== '2') {
            await voteService.voting(voteAddress, voterAddress, candidate);
            state = await voterService.getVoterState(voteAddress, voterAddress);
            if (state === '2') {
                Account.findOneAndUpdate({username: req.user.username}, {
                    $push: {votingVotes: voteAddress}
                }, { upsert: true }, (err, data) => {
                    if(err) res.send(err.toString());
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
});

module.exports = router;
