const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    password: String,
    etherAccount: String,
    votingVotes: [{address: String, isFinite: Boolean}],
    deployedVotes: [String]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
