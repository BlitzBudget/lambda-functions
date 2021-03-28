function FetchHelper() {}

const fetchAccount = require('../create-parameter/fetch-account');
const fetchAccounts = require('../fetch/fetch-accounts');
const convertAccountKeys = require('../convert/account-keys');

async function handleFetchBankAccount(event) {
  let BankAccountData;
  const params = fetchAccount.createParameter(event.params.querystring.walletId);

  await fetchAccounts.getBankAccountItem(params).then(
    (result) => {
      convertAccountKeys.convertAccountKeys(result);
      BankAccountData = result.Items;
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
