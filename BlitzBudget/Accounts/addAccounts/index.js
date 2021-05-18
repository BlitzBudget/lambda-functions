const addAccount = require('./data/add-account');

exports.handler = async (event) => {
  console.log('adding BankAccounts for ', JSON.stringify(event['body-json']));
  const response = event;

  await addAccount.addNewBankAccounts(event).then(
    (accountId) => {
      response['body-json'].accountId = accountId;
      console.log('successfully saved the new BankAccounts');
    },
    (err) => {
      throw new Error(`Unable to add the BankAccounts ${err}`);
    },
  );

  return response;
};
