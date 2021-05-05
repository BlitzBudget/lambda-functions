const fetchHelper = require('../../../utils/fetch-helper');
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

describe('fetchAllWallets', () => {
  test('Without User ID Data: Success', async () => {
    const responseWithoutEvents = await fetchHelper
      .fetchAllWallets(
        '',
        mockRequest['body-json'].userId,
        documentClient,
      );

    expect(responseWithoutEvents).not.toBeUndefined();
    expect(responseWithoutEvents.walletPK).toBe('Wallet#2020-12-21T20:35:49.295Z');
    expect(responseWithoutEvents.response).toStrictEqual({});
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });

  test('With Data: Success', async () => {
    const response = await fetchHelper
      .fetchAllWallets(mockRequest['body-json'].walletId, mockRequest['body-json'].userId, documentClient);

    expect(response).not.toBeUndefined();
    expect(response.walletPK).toBe('Wallet#2020-05-02T17:19:13.022Z');
    expect(response.response).not.toBeUndefined();
    expect(documentClient.get).toHaveBeenCalledTimes(1);
  });
});
