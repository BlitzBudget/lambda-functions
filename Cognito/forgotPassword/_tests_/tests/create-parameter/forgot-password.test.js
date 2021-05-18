const forgotPasswordParameter = require('../../../create-parameter/forgot-password');

describe('createParameter', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
    process.env.USER_POOL_ID = '3';
    process.env.CLIENT_ID = '4';
  });
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = forgotPasswordParameter.createParameter(event);
    const clientId = parameters.ClientId;
    const username = parameters.Username;
    expect(clientId).not.toBeUndefined();
    expect(username).not.toBeUndefined();
  });
});
