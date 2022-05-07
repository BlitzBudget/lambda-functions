const fetchWallet = require('../../../fetch/wallet');
const mockUser = require('../../fixtures/response/get-user');
const mockWalletResponse = require('../../fixtures/response/wallet');

const dynamoDB = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockWalletResponse),
  })),
};

describe('fetch Wallet', () => {
  const event = mockUser.UserAttributes[2].Value;
  test('With Data: Success', async () => {
    const response = await fetchWallet.getWallet(event, dynamoDB);
    expect(response).not.toBeUndefined();
    expect(response).not.toBeUndefined();
    expect(response[0].currency).not.toBeUndefined();
    expect(response[0].currency).toBe(mockWalletResponse.Items[0].currency);
    expect(response[0].wallet_balance).toBe(mockWalletResponse.Items[0].wallet_balance);
  });
});
