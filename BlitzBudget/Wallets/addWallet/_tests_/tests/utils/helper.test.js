const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/addWallet.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(events);

    expect(response.userId).not.toBeUndefined();
    expect(response.walletName).toBeUndefined();
    expect(response.currency).not.toBeUndefined();
  });
});
