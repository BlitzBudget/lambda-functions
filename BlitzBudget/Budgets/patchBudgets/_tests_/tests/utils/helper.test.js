const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/patchBudgets.json');
const mockFetchResponse = require('../../fixtures/response/fetchCategory.json');

describe('formulateDateFromRequest', () => {
  test('With Data: Success', () => {
    const today = helper.formulateDateFromRequest(mockRequest);
    expect(today.getMonth()).toBe(4);
    expect(today.getFullYear()).toBe(2020);
  });
});

describe('calculateCategory', () => {
  test('With Data: Success', () => {
    const response = helper.calculateCategory(mockFetchResponse, mockRequest);
    expect(response).not.toBeUndefined();
    expect(response.category_name).not.toBeUndefined();
    expect(response.category_total).not.toBeUndefined();
    expect(response.category_type).not.toBeUndefined();
    expect(response.pk).not.toBeUndefined();
    expect(response.sk).not.toBeUndefined();
  });
});
