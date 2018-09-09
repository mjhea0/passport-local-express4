const express = require('express');
const router = express.Router();
const vote = require('../controllers/vote.controller');

/* GET users listing. */
module.exports = router
    .get('/:election(public|finite)/:address/vote', vote.getVote)
    .post('/:election(public|finite)/:address/vote', vote.postVote);
