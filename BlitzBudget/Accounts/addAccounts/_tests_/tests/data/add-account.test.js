const addAccount = require('../../../data/add-account');

describe('addNewBankAccounts', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].walletId = '';
  event['body-json'].accountType = '';
  event['body-json'].bankAccountName = '';
  event['body-json'].linked = '';
  event['body-json'].accountBalance = '';
  event['body-json'].accountSubType = '';
  event['body-json'].selectedAccount = '';
  event['body-json'].primaryWallet = '';
  test('With Data: Success', () => {
    expect(addAccount.addNewBankAccounts(event)).not.toBeNull();
  });
});
