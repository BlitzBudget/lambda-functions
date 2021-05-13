const organizeBudget = require('../../../organize/wallet');
const mockResponse = require('../../fixtures/response/fetchWallet.json');

describe('organizeBudget: createParameter', () => {
  test('With Data: Success', () => {
    organizeBudget.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).not.toBeUndefined();
    expect(mockResponse.Items[0].userId).not.toBeUndefined();
    expect(mockResponse.Items[0].walletId).not.toBeUndefined();
    expect(mockResponse.Items[0].pk).toBeUndefined();
    expect(mockResponse.Items[0].sk).toBeUndefined();
  });
});
