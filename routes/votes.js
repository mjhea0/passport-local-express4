const express = require('express');
const router = express.Router();
const voteService = require('../services/vote.service');
const candidateService = require('../services/candidate.service');
const voterService = require('../services/voter.service');

/* GET users listing. */
router.get('/public|/private', (req, res) => {
    voteService.getVoteList(req.originalUrl === '/private')
        .then((voteSummaryList) => {
            res.render('voteList', {
                vote: voteSummaryList,
                user: req.user
            });
        })
        .catch((err) => {
            res.send(err.toString());
        });
});

router.get('/vote/:address', (req, res) => {
    const voteAddress = req.params.address;
    let voteDetail = {};
    voteService.voteSummary(voteAddress)
        .then((summary) => {
            voteDetail.summary = summary;
            candidateService.getCandidateList(voteAddress)
                .then((candidateList) => {
                    voteDetail.candidateList = candidateList;
                    voterService.getNumVoters(voteAddress)
                        .then((voterNumber) => {
                            voteDetail.voterNumber = voterNumber;
                            res.render('voteDetail', {
                                voteDetail: voteDetail,
                                user: req.user
                            });
                        })
                })
        })
        .catch((err) => {
            res.send(err.toString());
        });
});

module.exports = router;
