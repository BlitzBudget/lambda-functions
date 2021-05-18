const addScheduledTransaction = require('../../index');
const mockRequest = require('../fixtures/request/addScheduledTransactions.json');
const mockUpdateResponse = require('../fixtures/response/update-response.json');
const mockResponse = require('../fixtures/response/fetch-category.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
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
          .mockRejectedValueOnce(Promise.resolve(mockUpdateResponse)),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Add Scheduled Transactions item', () => {
  const event = mockRequest;
  test('Without Wallet Data: Error Update', async () => {
    await addScheduledTransaction
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
