const passport = require('passport');
const Account = require('../models/account');
const accountApi = require('../ethereum/api/account.api');
const electionApi = require('../ethereum/api/election.api');

exports.register = (req, res) =>
    res.render('account/register');

exports.create = async (req, res, next) => {
    const {username, password} = req.body;

    // 계정을 만듦
    const ethAccount = await accountApi.makeNewAccount(password);

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
};

exports.login = (req, res) =>
    res.render('account/login', {error: req.flash('error')});

exports.signIn = (req, res, next) =>
    req.session.save((err) => {
        if (err) return next(err);
        res.redirect('/');
    });

exports.logout = (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
};

exports.myInfo = async (req, res) => {
    // TODO: 변수명과 election 컨트롤러 고쳐야함
    if (!req.user) {
        res.redirect('/login')
    }
    let votingElectionsSummaryList;
    let deployedElectionsSummaryList;
    if (req.user.votingVotes.length) {
        votingElectionsSummaryList = await electionApi.getElectionSummaryList(req.user.votingVotes);
    }
    if (req.user.deployedVotes.length) {
        deployedElectionsSummaryList = await electionApi.getElectionSummaryList(req.user.deployedVotes);
    }
    res.render('account/myInfo', {
        votingVotes: votingElectionsSummaryList,
        deployedVotes: deployedElectionsSummaryList
    });
};