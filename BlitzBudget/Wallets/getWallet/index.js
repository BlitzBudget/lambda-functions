const fetchHelper = require('utils/fetch-helper');

exports.handler = async (event) => {
  console.log('fetching item for the userId ', event['body-json'].userId);
  let walletData = {};

  await fetchHelper.handleFetchWallet(event, walletData);

  return walletData;
};
