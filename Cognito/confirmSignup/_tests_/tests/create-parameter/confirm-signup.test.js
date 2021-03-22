const confirmSignupParameter = require('../../../create-parameter/confirm-signup');

describe('createConfirmSignupParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].confirmationCode = 'notempty';
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = confirmSignupParameter.createParameter(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters.ClientId).not.toBeUndefined();
    expect(parameters.ConfirmationCode).not.toBeUndefined();
    expect(parameters.Username).not.toBeUndefined();
  });
});
