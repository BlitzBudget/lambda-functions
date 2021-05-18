const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/deleteCategories.json');
const mockBudgetResponse = require('../fixtures/response/fetchBudget.json');
const mockTransactionResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockBudgetResponse),
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
  getBudgetItems: () => Promise.resolve(mockBudgetResponse),
}));

jest.mock('../../fetch/transaction', () => ({
  getTransactionItems: () => Promise.resolve(mockTransactionResponse),
}));

describe('Delete Categories item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await getBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].category).not.toBeUndefined();
  });
});
