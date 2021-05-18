const deleteAccount = require('../../index');
const mockRequest = require('../fixtures/request/deleteAccount.json');
const mockRecurringTransactionsResponse = require('../fixtures/response/fetchRecurringTransaction.json');
const mockTransactionsResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('../../fetch/recurring-transactions', () => ({
  getRecurringTransactionItems: () => Promise.resolve(mockRecurringTransactionsResponse),
}));

jest.mock('../../fetch/transactions', () => ({
  getTransactionItems: () => Promise.resolve(mockTransactionsResponse),
}));

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      batchWrite: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Fetch Delete item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await deleteAccount.handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].account).not.toBeUndefined();
  });
});
