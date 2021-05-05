const organizeWallet = require('../../../organize/wallet');
const mockResponse = require('../../fixtures/response/fetch-wallet.json');

describe('organizeWallet: createParameter', () => {
  test('With Data: Success', () => {
    organizeWallet.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).not.toBeUndefined();
    expect(mockResponse.Items[0].userId).not.toBeUndefined();
    expect(mockResponse.Items[0].walletId).not.toBeUndefined();
  });
});
