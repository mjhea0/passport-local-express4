const Web3 = require('web3');
require('dotenv').config();
const env = process.env;

let web3;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // 브라우저를 실행했고 메타마스크가 실행 중!
    web3 = new Web3(window.web3.currentProvider);
} else {
    // 서버 실행이거나 유저가 메타마스크가 없음
    // const provider = new Web3.providers.HttpProvider(
    //     'https://rinkeby.infura.io/rinkebyinfura1234'
    // );
    const provider = `http://${env.GANACHE_URL}:${env.GANACHE_PORT}`;
    web3 = new Web3(provider);
}

module.exports = web3;
