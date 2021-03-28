const fetchBudget = require('../../../fetch/budget');
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
      .getBudgetsItem(new Date(), mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Budget).toBeUndefined();
  });

  test('With Matching Category', async () => {
    mockRequest['body-json'].category = 'Category#2021-01-04T15:39:23.658Z';
    mockRequest['body-json'].dateMeantFor = 'Date#2021-01-03T10:16:52.571Z';

    const withDataResponse = await fetchBudget
      .getBudgetsItem(new Date(), mockRequest, documentClient);
    expect(withDataResponse).not.toBeUndefined();
    expect(withDataResponse.Budget).not.toBeUndefined();
    expect(withDataResponse.Budget.category).toBe(mockRequest['body-json'].category);
    expect(withDataResponse.Budget.date_meant_for).toBe(mockRequest['body-json'].dateMeantFor);
  });
});
