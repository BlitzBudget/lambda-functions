const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/patchTransactionsWithMatchingCategory.json');
const mockResponse = require('../fixtures/response/updateTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/category', () => ({
  getCategoryData: () => Promise.resolve({ Category: undefined }),
}));

describe('Patch Transaction item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await patchBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].amount).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].dateMeantFor).not.toBeUndefined();
    expect(response['body-json'].transactionId).not.toBeUndefined();
    expect(response['body-json'].category).not.toBeUndefined();
  });
});
