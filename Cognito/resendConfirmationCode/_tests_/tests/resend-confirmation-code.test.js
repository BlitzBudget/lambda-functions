const resendConfirmationCode = require('../../create-parameter/resend-confirmation-code');

describe('createParameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = resendConfirmationCode.createParameter(event);
    const clientId = parameters.ClientId;
    const username = parameters.Username;
    expect(clientId).not.toBeNull();
    expect(username).not.toBeNull();
  });
});
