const fetchBankParameter = require('../../../convert/account-keys');
const mockRequest = require('../../fixtures/request/patchAccount');

describe('fetchBankParameter: convertAccountKeys', () => {
  const event = { pk: mockRequest['body-json'].walletId, sk: mockRequest['body-json'].bankAccountId };
  test('With Data: Success', () => {
    const response = fetchBankParameter.convertAccountKeys(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].accountId).not.toBeUndefined();
  });
});
