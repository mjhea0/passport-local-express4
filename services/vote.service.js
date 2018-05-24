const web3 = require('../ethereum/web3');

const factory = require('../ethereum/factory');
const Vote = require('../ethereum/vote');

const voteAddressList = async (isPrivate) => {
  // const address = web3.eth.accounts.create(password).address;
  return await factory.methods.getDeployedVotes(isPrivate).call();
};

const voteSummary = async (voteAddress) => {
  const summary = await Vote(voteAddress)
    .methods.getVoteSummary()
    .call();
  summary['4'] = voteAddress;
  return summary;
};

const voteSummaryList = async (voteAddressList) => {
  const summaryList = await voteAddressList.map(async (voteAddress) => await voteSummary(voteAddress));
  const resultList = await Promise.all(summaryList);
  return resultList;
};

const getVoteList = async (isPrivate) => {
    const addressList = await voteAddressList(isPrivate);
    return await voteSummaryList(addressList);
};

module.exports = {
  getVoteList,
  voteAddressList,
  voteSummary,
  voteSummaryList
};
