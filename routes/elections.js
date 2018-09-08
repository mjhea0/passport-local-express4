const express = require('express');
const router = express.Router();
const Account = require('../mongo/models/account');
const electionApi = require('../ethereum/api/election.api');
const candidateService = require('../ethereum/api/candidate.api');
const voterApi = require('../ethereum/api/voter.api');

const election = require('../controllers/election.controller');

/* GET users listing. */
module.exports = router
    .get('/:election(public|finite)', election.getElectionList)
    .get('/:election(public|finite)/:address', election.getElectionDetail)
    .post('/:election(public|finite)/:address', election.postElectionState)
    .post('/:election(public|finite)/:address/modify', election.postElectionInformation)
    .get('/:election(public|finite)/:address/election', election.getVote)
    .post('/:election(public|finite)/:address/election', election.postVote);
