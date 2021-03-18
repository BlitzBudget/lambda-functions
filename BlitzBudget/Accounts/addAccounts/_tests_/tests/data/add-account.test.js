const addAccount = require('../../../data/add-account');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

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
  test('With Data: Success', async () => {
    const response = await addAccount.addNewBankAccounts(event);
    expect(response).not.toBeNull();
  });
});
