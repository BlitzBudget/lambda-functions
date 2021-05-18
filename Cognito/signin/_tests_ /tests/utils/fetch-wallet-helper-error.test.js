const walletHelper = require('../../../utils/fetch-wallet-helper');
const mockUser = require('../../fixtures/response/get-user');
const mockWalletResponse = require('../../fixtures/response/wallet');

const cognitoidentityserviceprovider = {
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn().mockResolvedValueOnce(mockWalletResponse),
    })),
  })),
};

jest.mock('../../../fetch/wallet', () => ({
  getWallet: () => Promise.resolve(mockWalletResponse.Items),
}));

describe('fetch Wallet', () => {
  const event = mockUser;

  test('With Data: Success', async () => {
    await walletHelper.fetchWalletFromUser(event, cognitoidentityserviceprovider)
      .catch((err) => {
        expect(err).not.toBeUndefined();
        expect(err.message).toMatch(/Unable to get the wallet at the moment/);
      });
  });
});
