const confirmSignupParameter = require('../../../create-parameter/confirm-signup');

describe('createConfirmSignupParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].confirmationCode = 'notempty';
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = confirmSignupParameter.createConfirmSignupParameters(event);
    expect(parameters).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.ConfirmationCode).not.toBeNull();
    expect(parameters.Username).not.toBeNull();
  });
});
