const filterCategory = require('../../../filter/category');
const mockResponse = require('../../fixtures/response/fetchCategory.json');
const mockRequest = require('../../fixtures/request/patchTransactions.json');

describe('organizeCategory: createParameter', () => {
  mockRequest['body-json'].category = 'Salary';
  test('With Data: Success', () => {
    const response = filterCategory.filter(mockResponse, mockRequest);
    expect(response).not.toBeUndefined();
    expect(response.sk).not.toBeUndefined();
    expect(response.pk).not.toBeUndefined();
  });
});
