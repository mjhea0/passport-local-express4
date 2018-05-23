const Web3 = require('web3');

// const web3 = new Web3(window.web3.currentProvider);

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // 브라우저를 실행했고 메타마스크가 실행 중!
  web3 = new Web3(window.web3.currentProvider);
} else {
  // 서버 실행이거나 유저가 메타마스크가 없음
  // const provider = new Web3.providers.HttpProvider(
  //     'https://rinkeby.infura.io/Y4ogyw7K7SGyOOBUXg0t'
  // );
  const provider = 'http://localhost:8545';
  web3 = new Web3(provider);
}

module.exports = web3;
