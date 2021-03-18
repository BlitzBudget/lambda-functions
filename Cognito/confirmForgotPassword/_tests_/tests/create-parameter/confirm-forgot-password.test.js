const confirmForgotPasswordParameter = require('../../../create-parameter/confirm-forgot-password');

describe('confirmForgotPasswordParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';
  event['body-json'].password = 'notempty';

  test('With Data: Success', () => {
    const parameters = confirmForgotPasswordParameter.createParameter(event);
    expect(parameters).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.ConfirmationCode).not.toBeNull();
    expect(parameters.Password).not.toBeNull();
    expect(parameters.Username).not.toBeNull();
  });
});
