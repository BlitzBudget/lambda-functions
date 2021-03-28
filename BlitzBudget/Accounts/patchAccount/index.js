const helper = require('./utils/helper');

exports.handler = async (event) => {
  console.log('updating BankAccounts for ', JSON.stringify(event['body-json']));
  /*
   * Change all the selected account to false
   */
  const events = await helper.unselectSelectedBankAccount(event);

  await helper.handleUpdateBankAccounts(events, event);

  return event;
};
