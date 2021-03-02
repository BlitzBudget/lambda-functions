const cognitoSignup = require('../../../cognito/signup');

jest.mock('aws-sdk', () => ({
  config: {
    update: () => {},
  },
  CognitoIdentityServiceProvider: jest.fn(() => ({
    signUp: (parameters) => jest.fn().mockReturnValueOnce({
      UserConfirmed: false,
      CodeDeliveryDetails: {
        Destination: parameters.email,
        DeliveryMedium: 'EMAIL',
        AttributeName: 'email',
      },
      UserSub: 'c5f9af98-ebcb-4c9c-8be4-9c1bc6bfbcad',
    }).mockReturnValueOnce({
      errorType: 'Error',
      errorMessage: 'Unable to signin from cognito  UsernameExistsException: User already exists.',
      trace: [
        'Error: Unable to signin from cognito  UsernameExistsException: User already exists.',
        '    at /var/task/index.js:23:14',
        '    at processTicksAndRejections (internal/process/task_queues.js:97:5)',
        '    at async Runtime.exports.handler (/var/task/index.js:20:5)',
      ],
    }),
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

  test('User Already Present: Success', () => {
    const response = cognitoSignup.signup(event);
    expect(response).not.toBeNull();
    expect(response.errorType).not.toBeNull();
  });
});
