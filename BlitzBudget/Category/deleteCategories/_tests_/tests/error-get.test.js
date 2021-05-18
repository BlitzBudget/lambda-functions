const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/deleteCategories.json');
const mockBudgetResponse = require('../fixtures/response/fetchBudget.json');
const mockTransactionResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockBudgetResponse),
      })),
      batchWrite: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockBudgetResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/budget', () => ({
  getBudgetItems: () => Promise.reject(mockBudgetResponse),
}));

jest.mock('../../fetch/transaction', () => ({
  getTransactionItems: () => Promise.reject(mockTransactionResponse),
}));

describe('Delete Categories item', () => {
  const event = mockRequest;
  test('With Data: Error Get', async () => {
    await getBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
