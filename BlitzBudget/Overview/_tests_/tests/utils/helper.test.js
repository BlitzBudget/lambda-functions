const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/overview.json');
const mockRequestWithoutWallet = require('../../fixtures/request/overviewWithoutWallet.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('Without User ID Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(events);

    expect(response.userId).not.toBeUndefined();
    expect(response.oneYearAgo).not.toBeUndefined();
    expect(response.startsWithDate).not.toBeUndefined();
    expect(response.endsWithDate).not.toBeUndefined();
  });

  test('With User ID Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(mockRequestWithoutWallet);

    expect(response.userId).not.toBeUndefined();
    expect(response.oneYearAgo).not.toBeUndefined();
    expect(response.startsWithDate).not.toBeUndefined();
    expect(response.endsWithDate).not.toBeUndefined();
  });
});
