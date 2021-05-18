const organizeBankAccount = require('../../../organize/bank-account');
const mockResponse = require('../../fixtures/response/fetch-wallet.json');

describe('organizeBankAccount: createParameter', () => {
  test('With Data: Success', () => {
    organizeBankAccount.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).not.toBeUndefined();
    expect(mockResponse.Items[0].accountId).not.toBeUndefined();
    expect(mockResponse.Items[0].walletId).not.toBeUndefined();
  });

  test('Without Data: Success', () => {
    mockResponse.Items = undefined;
    organizeBankAccount.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).toBeUndefined();
  });
});
