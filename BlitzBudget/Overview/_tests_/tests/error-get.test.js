const fetchOverview = require('../../index');
const mockRequest = require('../fixtures/request/overviewWithoutWallet.json');
const mockRequestWithWallet = require('../fixtures/request/overview.json');
const mockResponse = require('../fixtures/response/fetch-transaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      get: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Get Overview item', () => {
  const event = mockRequest;
  test('Without Wallet Data: Error get', async () => {
    await fetchOverview
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });

  test('Without Wallet Data: Error query', async () => {
    await fetchOverview
      .handler(mockRequestWithWallet).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
