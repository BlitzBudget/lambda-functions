const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/deleteAllWallets.json');
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
  SNS: jest.fn(() => ({
    publish: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
}));

describe('Delete all wallets item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await getBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response.Records).not.toBeUndefined();
  });
});
