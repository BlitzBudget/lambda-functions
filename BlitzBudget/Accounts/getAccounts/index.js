const fetchHelper = require('./utils/fetch-helper');

exports.handler = async (event) => {
  console.log(
    'fetching item for the walletId ',
    event.params.querystring.walletId,
  );

  const response = await fetchHelper.handleFetchBankAccount(event);
  return response;
};
