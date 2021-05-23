const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/deleteAllWallets.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({
          Items: [],
          Count: 0,
        }),
      })),
      batchWrite: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({
          Items: [],
          Count: 0,
        }),
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

describe('Delete all wallets item: Without Data', () => {
  const event = mockRequest;
  test('Without Data: Success', async () => {
    const response = await getBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response.Records).not.toBeUndefined();
  });
});
