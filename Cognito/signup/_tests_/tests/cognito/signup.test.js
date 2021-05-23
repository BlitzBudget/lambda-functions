const cognitoSignup = require('../../../cognito/signup');
const mockSuccess = require('../../fixtures/response/success');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    signUp: jest.fn((params) => ({
      promise: jest.fn()
        .mockResolvedValueOnce(mockSuccess(params)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
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
  test('With Data: Success', async () => {
    const response = await cognitoSignup.signup(event);
    expect(response).not.toBeUndefined();
    expect(response.UserConfirmed).toBe(false);
  });
});
