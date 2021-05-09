const organizeBudget = require('../../../organize/budget');
const mockResponse = require('../../fixtures/response/successWithoutOrganization.json');

describe('organizeBudget: createParameter', () => {
  test('With Data: Success', () => {
    organizeBudget.organize(mockResponse, [], true);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Budget).not.toBeUndefined();
    expect(mockResponse.Budget[0].budgetId).not.toBeUndefined();
    expect(mockResponse.Budget[0].walletId).not.toBeUndefined();
  });
});
