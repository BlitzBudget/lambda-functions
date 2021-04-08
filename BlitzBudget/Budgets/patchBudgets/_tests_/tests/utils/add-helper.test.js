const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/patchBudgets.json');
const mockRequestWithCategory = require('../../fixtures/request/existingCategory.json');
const mockResponse = require('../../fixtures/response/addCategory.json');
const mockFetchResponse = require('../../fixtures/response/fetchCategory.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('With Fetch Category Data', () => {
  documentClient.query = jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockFetchResponse),
  }));

  test('Success', async () => {
    const response = await addHelper
      .addANewCategoryIfNotPresent(mockRequest,
        documentClient);
    expect(response.createCategory).not.toBeUndefined();
    expect(response.events).not.toBeUndefined();
    expect(response.events.length).toBe(0);
  });
});

describe('With Exiting Category Information', () => {
  const documentClientWithCategory = {
    update: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce(mockRequestWithCategory),
    })),
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  };

  test('Success', async () => {
    const response = await addHelper
      .addANewCategoryIfNotPresent(mockRequestWithCategory,
        documentClientWithCategory);
    expect(response.createCategory).not.toBeUndefined();
    expect(response.events).not.toBeUndefined();
    expect(response.events.length).toBe(0);
  });
});
