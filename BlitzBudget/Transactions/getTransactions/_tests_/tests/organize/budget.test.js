const organizeBudget = require('../../../organize/budget');
const mockResponse = require('../../fixtures/response/success-without-organization.json');

describe('organizeBudget: createParameter', () => {
  test('With Data: Success', () => {
    organizeBudget.organize(mockResponse, 0.8, []);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Budget).not.toBeUndefined();
    expect(mockResponse.Budget[0].budgetId).not.toBeUndefined();
    expect(mockResponse.Budget[0].walletId).not.toBeUndefined();
  });

  test('Without Data: Success', () => {
    const emptyResponse = {
      Budget: undefined,
    };
    organizeBudget.organize(emptyResponse);
    expect(emptyResponse.Budget).toBeUndefined();
  });
});
