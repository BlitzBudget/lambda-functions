const fetchHelper = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/patchRecurringTransactions.json');
const mockResponse = require('../../fixtures/response/fetchCategory.json');
const mockCategoryResponse = require('../../fixtures/response/fetchCategory.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Category item', () => {
  test('Without Matching Category: Success', async () => {
    const categoryId = await fetchHelper
      .fetchCategory(mockRequest, new Date('2021-03'), documentClient);
    expect(categoryId).toBeUndefined();
  });
});

describe('Fetch Category item', () => {
  const documentClientWithCategoryData = {
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce(mockCategoryResponse),
    })),
  };
  test('With Matching Category: Success', async () => {
    const categoryId = await fetchHelper
      .fetchCategory(mockRequest, new Date('2021-03'), documentClientWithCategoryData);
    expect(categoryId).toBeUndefined();
  });
});
