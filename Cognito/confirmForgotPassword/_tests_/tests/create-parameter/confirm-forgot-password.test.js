const confirmForgotPasswordParameter = require('../../../create-parameter/confirm-forgot-password');

describe('confirmForgotPasswordParameters', () => {
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
  event['body-json'].password = 'notempty';
  event['body-json'].confirmationCode = 'notempty';

  test('With Data: Success', () => {
    const parameters = confirmForgotPasswordParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.ClientId).not.toBeUndefined();
    expect(parameters.ConfirmationCode).not.toBeUndefined();
    expect(parameters.Password).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
  });
});
