const changePassword = require('../../index');
const mockError = require('../fixtures/response/userNotFoundException.json');
const mockRequest = require('../fixtures/request/changePassword.json');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    changePassword: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.reject(mockError)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('changePassword', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    await changePassword
      .handler(event).catch((error) => {
        expect(error).not.toBeUndefined();
        expect(error.message).not.toBeUndefined();
        expect(error.message).toMatch(/Unable to change password from cognito/);
      });
  });
});
