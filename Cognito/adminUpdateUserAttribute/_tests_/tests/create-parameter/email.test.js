const emailParameter = require('../../../create-parameter/email');
const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency');

describe('mockEmail', () => {
  const event = mockUserCurrencyRequest;

  test('With Data: Success', () => {
    const response = emailParameter.createParameter(event['body-json'].username);
    expect(response.Username).not.toBeUndefined();
    expect(response.UserPoolId).not.toBeUndefined();
  });
});
