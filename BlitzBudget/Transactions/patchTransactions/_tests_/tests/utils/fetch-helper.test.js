const fetchCategory = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/patchTransactionsWithMatchingCategory.json');
const mockRequestWithoutCategory = require('../../fixtures/request/patchTransactions.json');
const mockResponse = require('../../fixtures/response/fetchCategory.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Category item', () => {
  test('Without Matching Category: Success', async () => {
    const events = [];
    const response = await fetchCategory
      .calculateAndFetchCategory(mockRequest, events, documentClient);
    expect(response).not.toBeUndefined();
    expect(events.length).toBe(0);
    expect(response.Category).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
    expect(documentClient.update).toHaveBeenCalledTimes(0);
  });

  test('With Matching Category', async () => {
    const documentClientWithUpdate = {
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    };

    const events = [];

    const withCategoryResponse = await fetchCategory
      .calculateAndFetchCategory(mockRequestWithoutCategory, events, documentClientWithUpdate);
    expect(withCategoryResponse.Category).toBeUndefined();
    expect(events.length).toBe(1);
    expect(documentClientWithUpdate.update).toHaveBeenCalledTimes(1);
  });
});
