const fetchHelper = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/getGoals.json');
const mockRequestByUser = require('../../fixtures/request/byUserId.json');
const mockResponse = require('../../fixtures/response/fetch-wallet.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
  get: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('fetchWalletInformation', () => {
  const events = [];
  test('Without User ID Data: Success', async () => {
    const walletID = await fetchHelper
      .fetchWalletInformation(mockRequestByUser['body-json'].walletId, mockRequestByUser['body-json'].userId, events, documentClient);

    expect(walletID).not.toBeUndefined();
    expect(walletID).toBe('Wallet#2020-12-21T20:35:49.295Z');
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });

  test('With User ID Data: Success', async () => {
    const walletID = await fetchHelper
      .fetchWalletInformation(
        mockRequest['body-json'].walletId,
        mockRequestByUser['body-json'].userId,
        events,
        documentClient,
      );

    expect(walletID).not.toBeUndefined();
    expect(events.length).toBe(1);
  });
});
