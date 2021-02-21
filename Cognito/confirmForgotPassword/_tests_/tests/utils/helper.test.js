const helper = require('../../../utils/helper');

describe('confirmForgotPasswordParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';
  event['body-json'].password = 'notempty';

  test('With Data: Success', () => {
    const parameters = helper.confirmForgotPasswordParameters(event);
    expect(parameters).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.ConfirmationCode).not.toBeNull();
    expect(parameters.Password).not.toBeNull();
    expect(parameters.Username).not.toBeNull();
  });
});

describe('loginParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].password = 'notempty';
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = helper.loginParameters(event);
    expect(parameters).not.toBeNull();
    expect(parameters.AuthFlow).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.AuthParameters).not.toBeNull();
    expect(parameters.AuthParameters.USERNAME).not.toBeNull();
    expect(parameters.AuthParameters.PASSWORD).not.toBeNull();
  });
});
