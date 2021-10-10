const organizeCategory = require('../../../organize/category');
const mockResponse = require('../../fixtures/response/success-without-organization.json');

describe('organizeCategory: createParameter', () => {
  test('With Data: Success', () => {
    const response = organizeCategory.organize(mockResponse, [], true);
    expect(response).not.toBeUndefined();
    expect(response.incomeTotal).not.toBe(0);
    expect(response.expenseTotal).not.toBe(0);
    expect(response.periodBalance).not.toBe(0);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Category).not.toBeUndefined();
    expect(mockResponse.Category[0].categoryId).not.toBeUndefined();
    expect(mockResponse.Category[0].walletId).not.toBeUndefined();
    expect(mockResponse.Category[1].categoryId).not.toBeUndefined();
    expect(mockResponse.Category[1].walletId).not.toBeUndefined();
  });

  test('Without Data: Success', () => {
    const emptyResponse = {
      Category: undefined,
    };
    const response = organizeCategory.organize(emptyResponse);
    expect(response).not.toBeUndefined();
    expect(response.incomeTotal).toBe(0);
    expect(response.expenseTotal).toBe(0);
    expect(response.periodBalance).toBe(0);
    expect(emptyResponse.Category).toBeUndefined();
  });
});
