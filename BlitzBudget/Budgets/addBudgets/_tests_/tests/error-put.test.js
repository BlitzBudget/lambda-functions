const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/addBudget.json');
const mockResponse = require('../fixtures/response/fetch-budget.json');
const mockDateResponse = require('../fixtures/response/fetch-date.json');
const mockCategoryResponse = require('../fixtures/response/fetch-category.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      put: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  })),
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
  test('With Data: Error put', async () => {
    await getBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
