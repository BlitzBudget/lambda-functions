const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/patchRecurringTransactionNewCategory.json');
const mockResponse = require('../fixtures/response/updateTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/category', () => ({
  getCategoryData: () => Promise.resolve({ Category: undefined }),
}));

describe('Patch Budget item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await patchBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].amount).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].dateMeantFor).not.toBeUndefined();
    expect(response['body-json'].recurringTransactionId).not.toBeUndefined();
    expect(response['body-json'].category).not.toBeUndefined();
  });
});
