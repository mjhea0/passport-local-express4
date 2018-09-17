const mongoose = require('mongoose');

const Account = require('../app/models/account');
const config = require('../config/index');
const contractAddress = require('../config/contract-address.json');

mongoose.connect(config.db).connection.on('error', (err) => console.error(err.message));

// DB 변경
Account.findOne({
    'username': 'region@election.com'
}, (err, account) => {
    if (err) return console.log(err.message);
    account.etherAccount = contractAddress['test_region_address'];
    account.deployedVotes = [contractAddress['test_region_contract']];
    account.save((err) => {
        if (err) return console.log(err.message);
        console.info("지방선거 완료");
        process.exit();
    })
});

// mongo.disconnect((err) => {
//     if(err) return console.log(err.message);
//     console.info("접속종료")
// });
