const organizeCategory = require('../../../organize/category');
const mockResponse = require('../../fixtures/response/successWithoutOrganization.json');

describe('organizeCategory: createParameter', () => {
  test('With Data: Success', () => {
    const categoryList = {
      'Category#2021-01-04T15:20:13.109Z': 20,
      'Category#2021-01-04T15:20:13.110Z': 30,
    };
    const response = organizeCategory.organize(mockResponse, categoryList, false);
    expect(response).not.toBeUndefined();
    expect(response.incomeTotal).not.toBe(0);
    expect(response.expenseTotal).not.toBe(0);
    expect(response.periodBalance).not.toBe(0);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Category).not.toBeUndefined();
    expect(mockResponse.Category[0].categoryId).not.toBeUndefined();
    expect(mockResponse.Category[0].walletId).not.toBeUndefined();
  });
});
