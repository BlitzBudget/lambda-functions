const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency.json');
const emailParameter = require('../../../create-parameter/email');

describe('mockEmail', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
    process.env.USER_POOL_ID = '3';
  });
  const event = mockUserCurrencyRequest;

  test('With Data: Success', () => {
    const response = emailParameter.createParameter(event['body-json'].username);
    expect(response.Username).not.toBeUndefined();
    expect(response.UserPoolId).not.toBeUndefined();
  });
});
