const fetchWallet = require('../../../fetch/wallet');
const mockRequest = require('../../fixtures/request/getWallets.json');
const mockResponse = require('../../fixtures/response/fetchWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Fetch Wallet item', () => {
  test('Without Matching Wallet: Success', async () => {
    const response = await fetchWallet
      .getWalletItem(mockRequest['body-json'].userId, 'walletId');
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
  });
});
