const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/existingCategory.json');
const mockResponse = require('../fixtures/response/fetchBudget.json');

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

jest.mock('../../fetch/budget', () => ({
  getBudgetsItem: () => Promise.resolve({ Budget: undefined }),
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
    expect(response['body-json'].budgetId).not.toBeUndefined();
    expect(response['body-json'].category).not.toBeUndefined();
    expect(response['body-json'].categoryName).not.toBeUndefined();
    expect(response['body-json'].dateMeantFor).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
  });
});
