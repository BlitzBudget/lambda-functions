const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/deleteCategories.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(events);

    expect(response.curentPeriod).not.toBeUndefined();
    expect(response.walletId).not.toBeUndefined();
  });
});
