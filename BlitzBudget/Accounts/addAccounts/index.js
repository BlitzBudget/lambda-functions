const helper = require('./utils/helper');
const addAccount = require('./data/add-account');

exports.handler = async (event) => {
  console.log('adding BankAccounts for ', JSON.stringify(event['body-json']));
  const response = event['body-json'];
  const walletId = event['body-json'].primaryWallet;
  const { accountType } = event['body-json'];
  const { bankAccountName } = event['body-json'];
  const { accountBalance } = event['body-json'];
  const { selectedAccount } = event['body-json'];

  /*
   * If accountType, bankAccountName, accountBalance or selectedAccount is empty
   */
  helper.checkIfRequestEmpty(
    accountType,
    bankAccountName,
    accountBalance,
    selectedAccount,
    walletId,
  );

  await addAccount.addNewBankAccounts(event).then(
    (addResponse) => {
      response.accountId = addResponse.accountId;
      console.log('successfully saved the new BankAccounts');
    },
    (err) => {
      throw new Error(`Unable to add the BankAccounts ${err}`);
    },
  );

  return event;
};
