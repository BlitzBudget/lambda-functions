const organizeWallet = require('../../../organize/wallet');
const mockResponse = require('../../fixtures/response/success.json');

describe('organizeWallet: createParameter', () => {
  test('With Data: Success', () => {
    organizeWallet.organize(mockResponse, 'sk');
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse['body-json']).not.toBeUndefined();
    expect(mockResponse['body-json'].walletId).not.toBeUndefined();
    expect(mockResponse['body-json'].wallet_balance).not.toBeUndefined();
    expect(mockResponse['body-json'].total_debt_balance).not.toBeUndefined();
    expect(mockResponse['body-json'].total_asset_balance).not.toBeUndefined();
  });
});
