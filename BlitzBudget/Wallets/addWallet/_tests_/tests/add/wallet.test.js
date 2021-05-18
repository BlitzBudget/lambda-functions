const addWallet = require('../../../add/wallet');
const mockRequest = require('../../fixtures/request/addWallet.json');
const mockResponse = require('../../fixtures/response/addWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Add New Wallet item', () => {
  test('With Data: Success', async () => {
    const response = await addWallet
      .addNewWallet(mockRequest, 'userId', 'chosenCurrency', 'walletName');
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.WalletResponse).not.toBeUndefined();
  });
});
