const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/addBudget.json');
const mockResponse = require('../fixtures/response/fetch-budget.json');
const mockDateResponse = require('../fixtures/response/fetch-date.json');
const mockCategoryResponse = require('../fixtures/response/fetch-category.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

jest.mock('../../fetch/category', () => ({
  getCategoryData: () => Promise.resolve(mockCategoryResponse),
}));

jest.mock('../../fetch/date', () => ({
  getDateData: () => Promise.resolve(mockDateResponse),
}));

describe('Add Budget item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await getBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json'].budgetId).not.toBeUndefined();
    expect(response['body-json'].dateMeantFor).not.toBeUndefined();
    expect(response['body-json'].category).not.toBeUndefined();
    expect(response['body-json'].dateMeantFor).toMatch(/Date#/);
    expect(response['body-json'].category).toMatch(/Category#/);
  });
});
