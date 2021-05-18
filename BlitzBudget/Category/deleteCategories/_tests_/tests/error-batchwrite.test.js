const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/deleteCategories.json');
const mockBudgetResponse = require('../fixtures/response/fetchBudget.json');
const mockTransactionResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockBudgetResponse),
      })),
      batchWrite: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockBudgetResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/budget', () => ({
  getBudgetItems: () => Promise.resolve(mockBudgetResponse),
}));

jest.mock('../../fetch/transaction', () => ({
  getTransactionItems: () => Promise.resolve(mockTransactionResponse),
}));

describe('Delete Categories item', () => {
  const event = mockRequest;
  test('With Data: Error Batch Write', async () => {
    await getBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
