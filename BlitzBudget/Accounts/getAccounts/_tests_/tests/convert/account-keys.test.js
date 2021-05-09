const fetchBankParameter = require('../../../convert/account-keys');
const mockRequest = require('../../fixtures/response/fetchAccount');

describe('fetchBankParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    fetchBankParameter.convertAccountKeys(event);
    expect(event).not.toBeUndefined();
    expect(event.Items).not.toBeUndefined();
    expect(event.Items[0]).not.toBeUndefined();
    expect(event.Items[0]).not.toBeUndefined();
    expect(event.Items[0].walletId).not.toBeUndefined();
    expect(event.Items[0].accountId).not.toBeUndefined();
  });
});
