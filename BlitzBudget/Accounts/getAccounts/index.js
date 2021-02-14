const helper = require('utils/helper');
const fetchAccounts = require('fetch/fetch-accounts');

exports.handler = async (event) => {
  console.log(
    'fetching item for the walletId ',
    event.params.querystring.walletId
  );
  return await handleFetchBankAccount(event);
};

async function handleFetchBankAccount(event) {
  let BankAccountData;
  let params = helper.createParameters(event.params.querystring.walletId);

  await fetchAccounts.getBankAccountItem(params).then(
    function (result) {
      BankAccountData = result;
    },
    function (err) {
      throw new Error(
        'Unable error occured while fetching the BankAccount ' + err
      );
    }
  );

  return BankAccountData;
}
