const LocalStrategy = require('passport-local').Strategy;
const Account = require('../app/models/account');


module.exports = (passport) => {
    passport.use(new LocalStrategy(Account.authenticate()));
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
};