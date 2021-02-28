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
    expect(addAccount.addNewBankAccounts('en')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(addAccount.addNewBankAccounts('')).toBe(true);
    expect(addAccount.addNewBankAccounts(null)).toBe(true);
  });
});
