const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/getGoals.json');
const mockRequestByUser = require('../../fixtures/request/byUserId.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('Without User ID Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(events);

    expect(response.userId).toBeUndefined();
    expect(response.oneYearAgo).not.toBeUndefined();
    expect(response.today).not.toBeUndefined();
  });

  test('With User ID Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(mockRequestByUser);

    expect(response.userId).not.toBeUndefined();
    expect(response.oneYearAgo).not.toBeUndefined();
    expect(response.today).not.toBeUndefined();
  });
});
