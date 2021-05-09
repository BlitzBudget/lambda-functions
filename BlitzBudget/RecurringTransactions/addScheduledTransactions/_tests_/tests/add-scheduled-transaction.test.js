const addScheduledTransaction = require('../../index');
const mockRequest = require('../fixtures/request/addScheduledTransactions.json');
const mockUpdateResponse = require('../fixtures/response/update-response.json');
const mockResponse = require('../fixtures/response/fetch-category.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn()
          .mockResolvedValueOnce(Promise.resolve(mockResponse)),
      })),
      batchWrite: jest.fn(() => ({
        promise: jest.fn()
          .mockResolvedValueOnce(Promise.resolve({})),
      })),
      update: jest.fn(() => ({
        promise: jest.fn()
          .mockResolvedValueOnce(Promise.resolve(mockUpdateResponse)),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Add Scheduled Transactions item', () => {
  const event = mockRequest;
  test('Without Wallet Data: Success', async () => {
    const response = await addScheduledTransaction
      .handler(event);
    expect(response).toBeUndefined();
  });
});
