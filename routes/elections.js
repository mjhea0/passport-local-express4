const express = require('express');
const router = express.Router();
const election = require('../controllers/election.controller');

/* GET users listing. */
module.exports = router
    .get('/:election(public|finite)', election.getElectionList)
    .get('/:election(public|finite)/:address', election.getElectionDetail)
    .post('/:election(public|finite)/:address', election.postElectionState)
    .post('/:election(public|finite)/:address/modify', election.postElectionInformation);
