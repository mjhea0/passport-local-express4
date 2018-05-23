const express = require('express');
const router = express.Router();
const voteService = require('../services/vote.service');

/* GET users listing. */
router.get('/public|private', (req, res, next) => {
  // res.send('로딩중입니다...');
  voteService.getVoteList(req.originalUrl === '/private')
      .then((voteSummaryList) => {
        res.render('voteList', {
            vote : voteSummaryList,
            user : req.user
        });
      })
      .catch((err) => {
        res.send(err.toString());
      });
});

module.exports = router;
