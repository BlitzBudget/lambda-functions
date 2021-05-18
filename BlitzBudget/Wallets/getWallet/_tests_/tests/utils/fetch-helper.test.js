const fetchHelper = require('../../../utils/fetch-helper');
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
  const response = {};
  test('Without Matching Wallet: Success', async () => {
    await fetchHelper
      .handleFetchWallet(mockRequest, response);
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.Wallet[0].currency).toBe('Euro');
  });
});
