const fetchWallet = require('../../../fetch/wallet');
const mockRequest = require('../../fixtures/request/getTransactions.json');
const mockResponse = require('../../fixtures/response/fetch-wallet.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Wallet item', () => {
  test('Without Matching Wallet: Success', async () => {
    const response = await fetchWallet
      .getWalletsData(mockRequest['body-json'].walletId, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
