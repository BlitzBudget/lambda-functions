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
        promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
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
  test('With Data: Success', async () => {
    const response = await getBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response.Records).not.toBeUndefined();
  });
});
