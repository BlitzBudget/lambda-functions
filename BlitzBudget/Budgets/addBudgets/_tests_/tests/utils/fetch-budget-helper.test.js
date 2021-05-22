const fetchBudget = require('../../../utils/fetch-budget-helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');
const mockResponse = require('../../fixtures/response/fetch-budget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Budget item', () => {
  test('Without Matching Category: Success', async () => {
    const response = await fetchBudget
      .fetchBudget(new Date(), mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Budget).toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });

  test('With Matching Category', async () => {
    mockRequest['body-json'].category = 'Category#2021-01-04T15:39:23.658Z';
    mockRequest['body-json'].dateMeantFor = 'Date#2021-01-03T10:16:52.571Z';

    const withBudgetResponse = await fetchBudget
      .fetchBudget(new Date(), mockRequest, documentClient);
    expect(withBudgetResponse).not.toBeUndefined();
    expect(withBudgetResponse.Budget).not.toBeUndefined();
    expect(withBudgetResponse.Budget.category).toBe(mockRequest['body-json'].category);
    expect(withBudgetResponse.Budget.date_meant_for).toBe(mockRequest['body-json'].dateMeantFor);
  });

  test('Without Matching Category: Error', async () => {
    const documentClientError = {
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    };

    await fetchBudget
      .fetchBudget(new Date(), mockRequest, documentClientError).catch((err) => {
        expect(err.message).toMatch(/Unable to get the budget item to check if the budget/);
      });
    expect(documentClientError.query).toHaveBeenCalledTimes(1);
  });
});
