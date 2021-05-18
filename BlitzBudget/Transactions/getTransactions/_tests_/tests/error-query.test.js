const getTransaction = require('../../index');
const mockRequest = require('../fixtures/request/byUserId.json');
const mockResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  })),
  SNS: jest.fn(() => ({
    publish: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Get Transaction item', () => {
  const event = mockRequest;
  test('With Data: Error Query', async () => {
    await getTransaction
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
