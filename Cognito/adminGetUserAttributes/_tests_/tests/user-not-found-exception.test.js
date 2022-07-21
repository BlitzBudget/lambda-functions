const adminGetUser = require('../../index');
const mockError = require('../fixtures/response/userNotFoundException.json');
const mockUserAttributes = require('../fixtures/request/getUserAttributes.json');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    adminGetUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.reject(mockError)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('fetchUser', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });
  const event = mockUserAttributes;

  test('With Data: Success', async () => {
    await adminGetUser.handler(event).catch((error) => {
      expect(error).not.toBeUndefined();
      expect(error.message).not.toBeUndefined();
      expect(error.message).toMatch(/Error getting user attributes from cognito/);
    });
  });
});
