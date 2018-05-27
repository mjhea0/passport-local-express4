const express = require('express');
const router = express.Router();
const voteService = require('../services/vote.service');
const candidateService = require('../services/candidate.service');
const voterService = require('../services/voter.service');

/* GET users listing. */
router.get('/:vote(public|private)', (req, res) => {
    voteService.getVoteList(req.originalUrl === '/private')
        .then((voteSummaryList) => {
            res.render('vote/voteList', {
                isPrivate: req.originalUrl === '/private' ? 'private' : 'public',
                vote: voteSummaryList
            });
        })
        .catch((err) => {
            res.send(err.toString());
        });
});

router.get('/:vote(public|private)/:address', (req, res) => {
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

                            if(req.user) {
                                voterService.isOwner(voteAddress, req.user.etherAccount)
                                    .then((isVoteOwner) => {
                                        voteDetail.owner = isVoteOwner;
                                        res.render('vote/voteDetail', {
                                            voteDetail: voteDetail,
                                            path: req.path
                                        });
                                    })
                            } else {
                                res.render('vote/voteDetail', {
                                    voteDetail: voteDetail,
                                    path: req.path
                                });
                            }
                        })
                })
        })
        .catch((err) => {
            res.send(err.toString());
        });
});

router.post('/:vote(public|private)/:address', (req, res) => {
    const voteAddress = req.params.address;
    const voterAddress = req.user.etherAccount;
    const state = req.body.state;
    voteService.setVoteState(voteAddress, voterAddress, state)
        .then((success) => {
            if(success) {
                res.redirect(req.path)
            } else {
                res.send("실패");
            }
        })
        .catch((err) => {
            res.send(err.toString());
        })
});

router.get('/:vote(public|private)/:address/vote', (req, res) => {
    const voteAddress = req.params.address;
    const user = req.user;
    // voterService.getVoterState()
});

module.exports = router;
