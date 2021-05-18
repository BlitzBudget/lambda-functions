const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/deleteAllItemsFromWallet.json');
const mockFetchResponse = require('../fixtures/response/fetchResponse.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
      })),
      batchWrite: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockFetchResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/items', () => ({
  getAllItems: () => Promise.resolve(mockFetchResponse),
}));

describe('Delete Categories item', () => {
  const event = mockRequest;
  test('With Data: Error Batchwrite', async () => {
    await getBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
