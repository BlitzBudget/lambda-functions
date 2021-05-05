const fetchWallet = require('../../../fetch/wallet');
const mockRequest = require('../../fixtures/request/overview.json');
const mockResponse = require('../../fixtures/response/fetch-wallet.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
  get: jest.fn(() => ({
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

describe('Fetch Wallet item With both pk and sk', () => {
  test('Without Matching Wallet: Success', async () => {
    const response = await fetchWallet
      .getWalletData(
        mockRequest['body-json'].userId,
        mockRequest['body-json'].walletId,
        documentClient,
      );
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(documentClient.get).toHaveBeenCalledTimes(1);
  });
});
