const Account = require('../models/account');
const mongo = require('./mongo');
const contractAddress = require('../config/contract-address.json');

mongo.connection.on('error', (err) => console.error(err.message));

// DB 변경
Account.findOne({
    'username': 'wlqkd@tjsrj.vote'
}, (err, account) => {
    if (err) return console.log(err.message);
    account.etherAccount = contractAddress.test_wlqkd_address;
    account.deployedVotes = [contractAddress.test_wlqkd_contract];
    account.save((err) => {
        if (err) return console.log(err.message);
        console.info("퍼블릭 완료");
    })
});

Account.findOne({
    'username': 'gksqkx@eo.vote'
}, (err, account) => {
    if (err) return console.log(err.message);
    account.etherAccount = contractAddress.test_qkxeo_address;
    account.deployedVotes = [contractAddress.test_qkxeo_contract];
    account.save((err) => {
        if (err) return console.log(err.message);
        console.info("프라이빗 완료");
    })
});

// mongo.disconnect((err) => {
//     if(err) return console.log(err.message);
//     console.info("접속종료")
// });
