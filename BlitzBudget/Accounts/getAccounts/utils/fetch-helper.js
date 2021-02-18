const FetchHelper = () => {};

const helper = require('./helper');
const fetchAccounts = require('../fetch/fetch-accounts');

async function handleFetchBankAccount(event) {
  let BankAccountData;
  const params = helper.createParameters(event.params.querystring.walletId);

  await fetchAccounts.getBankAccountItem(params).then(
    (result) => {
      BankAccountData = result;
    },
    (err) => {
      throw new Error(
        `Unable error occured while fetching the BankAccount ${err}`,
      );
    },
  );

  return BankAccountData;
}

FetchHelper.prototype.handleFetchBankAccount = handleFetchBankAccount;
// Export object
module.exports = new FetchHelper();
