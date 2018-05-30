const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
const accountService = require('../services/account.service');

router.get('/register', (req, res) => {
    res.render('account/register');
});

router.post('/register', async (req, res, next) => {
    const {username, password} = req.body;

    // 계정을 만듦
    const ethAccount = await accountService.makeNewAccount(password);

    Account.register(new Account(
        {
            username : username,
            etherAccount : ethAccount.address
        }), password, (err, account) => {
        if (err) {
            return res.render('account/register', { error : err.message });
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
    res.render('account/login', { error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
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


router.get('/myInfo', (req, res, next) => {
    if(!req.user) {
        res.redirect('/login')
    }
    res.render('account/myInfo');
});

module.exports = router;
