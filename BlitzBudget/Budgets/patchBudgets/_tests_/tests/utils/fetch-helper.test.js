const fetchHelper = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/existingCategory.json');
const mockResponse = require('../../fixtures/response/fetchBudget.json');
const mockCategoryResponse = require('../../fixtures/response/fetchCategory.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Budget item', () => {
  test('Error', async () => {
    await fetchHelper
      .fetchBudget(mockRequest, documentClient).catch((error) => {
        expect(error).not.toBeUndefined();
        expect(error.message).not.toBeUndefined();
        expect(error.message).toBe('Unable to create a new budget for an existing category');
      });
  });
});

describe('Fetch Budget item without data', () => {
  const documentClientWithoutData = {
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  };
  test('Success', async () => {
    const response = await fetchHelper
      .fetchBudget(mockRequest, documentClientWithoutData);
    expect(response).toBeUndefined();
  });
});

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
