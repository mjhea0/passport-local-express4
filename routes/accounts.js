const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
const accountService = require('../services/account.service');
const voteService = require('../services/vote.service');
const mailer = require('../util/mail');

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', async (req, res, next) => {
    const {username, password} = req.body;

    // 계정을 만듦
    const ethAccount = await accountService.makeNewAccount(password);

    Account.register(new Account(
        {
            username: username,
            etherAccount: ethAccount.address
        }), password, (err, account) => {
        if (err) {
            return res.render('account/register', {error: err.message});
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/login', (req, res) => {
    res.render('account/login', {error: req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


router.get('/myInfo', async (req, res, next) => {
    if (!req.user) {
        res.redirect('/login')
    }
    let votingVoteSummaryList;
    let deployedVoteSummaryList;
    if(req.user.votingVotes.length) {
        votingVoteSummaryList = await voteService.voteSummaryList(req.user.votingVotes);
    }
    if(req.user.deployedVotes.length) {
        deployedVoteSummaryList = await voteService.voteSummaryList(req.user.deployedVotes);
    }
    const voteSummaryList = await voteService.getVoteList(false);
    res.render('account/myInfo', {
        votingVotes: votingVoteSummaryList,
        deployedVotes: deployedVoteSummaryList
    });
});


router.get('/voterequest', (req, res, next) => {
    if (!req.user) {
        res.redirect('/login')
    }
    res.render('account/voteCreate');
});


router.post('/requestresult', (req, res, next) => {

    console.log('접근');
    if (!req.user) {
        res.redirect('/login')
    }
    let to = 'kluge0221@gmail.com';
    let title = req.body.votetitle;
    let content = req.body.votecontent;

    mailer('already setting', to, title, content, function (err) {
        if (err) {
            console.log('메일발송에러' + err);
        } else {
            res.send('메일 발송 완료');

        }
    });
});


module.exports = router;
