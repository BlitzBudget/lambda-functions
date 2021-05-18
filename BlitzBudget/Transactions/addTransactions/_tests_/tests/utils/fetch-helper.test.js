const fetchHelper = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/addTransactions.json');
const mockResponse = require('../../fixtures/response/fetchCategory.json');
const mockCategoryResponse = require('../../fixtures/response/fetchCategory.json');
const mockDateResponse = require('../../fixtures/response/success.json');

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

describe('Fetch Date item', () => {
  const documentClientWithDate = {
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce(mockDateResponse),
    })),
  };
  test('Without Matching Date: Success', async () => {
    const dateMeantFor = await fetchHelper
      .fetchDate(mockRequest, new Date('2021-03'), documentClientWithDate);
    expect(dateMeantFor).toBeUndefined();
  });
});

describe('Fetch Date item: ERROR', () => {
  const documentClientWithError = {
    query: jest.fn(() => ({
      promise: jest.fn().mockRejectedValueOnce(mockResponse),
    })),
  };

  test('Without Matching Date: Error', async () => {
    const dateMeantFor = await fetchHelper
      .fetchDate(mockRequest, new Date('2021-03'), documentClientWithError).catch((err) => {
        expect(err).not.toBeUndefined();
      });
    expect(dateMeantFor).toBeUndefined();
  });
});
