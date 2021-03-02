const cognitoSignup = require('../../../cognito/signup');
const mockSuccess = require('../../fixtures/response/success');
const mockUsernameExistsException = require('../../fixtures/response/user-already-exists');

jest.mock('aws-sdk', () => ({
  config: {
    update: jest.fn(),
  },
  CognitoIdentityServiceProvider: jest.fn(() => ({
    signUp: (parameters) => jest.fn()
      .mockReturnValueOnce(mockSuccess(parameters))
      .mockReturnValueOnce(mockUsernameExistsException),
  })),
}));

describe('signup', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].firstname = 'Nagarjun';
  event['body-json'].lastname = 'Nagesh';
  event['body-json'].password = '12345678';
  event['body-json'].username = 'nagarjun_nagesh@outlook.com';
  event.params = {};
  event.params.header = {};
  event.params.header['Accept-Language'] = 'en';
  test('With Data: Success', () => {
    const response = cognitoSignup.signup(event);
    expect(response).not.toBeNull();
    expect(response.UserConfirmed).not.toBeNull();
  });

  test('User Already Present: Error', () => {
    const response = cognitoSignup.signup(event);
    expect(response).not.toBeNull();
    expect(response.errorType).not.toBeNull();
  });
});
