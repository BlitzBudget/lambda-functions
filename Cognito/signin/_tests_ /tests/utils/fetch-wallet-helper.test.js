const walletHelper = require('../../../utils/fetch-wallet-helper');
const mockUser = require('../../fixtures/response/get-user');
const mockWalletResponse = require('../../fixtures/response/wallet');

const cognitoidentityserviceprovider = {
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn().mockResolvedValueOnce(mockWalletResponse),
    })),
  },
};

jest.mock('../../../fetch/wallet', () => ({
  getWallet: () => Promise.resolve(mockWalletResponse.Items),
}));

describe('fetch Wallet', () => {
  const event = mockUser;

  test('With Data: Success', async () => {
    const response = await walletHelper.fetchWalletFromUser(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.Wallet[0].currency).not.toBeUndefined();
    expect(response.Wallet[0].currency).toBe(mockWalletResponse.Items[0].currency);
    expect(response.Wallet[0].wallet_balance).toBe(mockWalletResponse.Items[0].wallet_balance);
  });
});
