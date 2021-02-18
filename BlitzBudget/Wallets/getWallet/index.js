const fetchHelper = require('./utils/fetch-helper');

exports.handler = async (event) => {
  console.log('fetching item for the userId ', event['body-json'].userId);
  const walletData = {};

  await fetchHelper.handleFetchWallet(event, walletData);

  return walletData;
};
