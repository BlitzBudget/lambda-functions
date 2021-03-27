const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/addAccounts');

describe('checkIfRequestEmpty', () => {
  test('With Data: Success', () => {
    const event = mockRequest;
    const walletId = event['body-json'].primaryWallet;
    const { accountType } = event['body-json'];
    const { bankAccountName } = event['body-json'];
    const { accountBalance } = event['body-json'];
    const { selectedAccount } = event['body-json'];
    expect(helper.checkIfRequestEmpty(accountType,
      bankAccountName,
      accountBalance,
      selectedAccount,
      walletId)).toBeUndefined();
  });
});
