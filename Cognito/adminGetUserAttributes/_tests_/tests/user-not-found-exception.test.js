const adminGetUser = require('../../index');
const mockError = require('../fixtures/response/userNotFoundException');
const mockUserAttributes = require('../fixtures/request/getUserAttributes');

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
  const event = mockUserAttributes;

  test('With Data: Success', async () => {
    await adminGetUser.handler(event).catch((error) => {
      expect(error).not.toBeUndefined();
      expect(error.message).not.toBeUndefined();
      expect(error.message).toMatch(/Error getting user attributes from cognito/);
    });
  });
});