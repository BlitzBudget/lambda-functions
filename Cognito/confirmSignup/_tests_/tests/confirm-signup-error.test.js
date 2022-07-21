const cognitoLogin = require('../../index');
const mockLoginError = require('../fixtures/response/userNotFoundException.json');
const mockConfirmSignupSuccess = require('../fixtures/response/confirmSignup.json');
const mockFetchUserSuccess = require('../fixtures/response/fetchUser.json');
const mockRequest = require('../fixtures/request/confirmSignup.json');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    initiateAuth: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockLoginError)),
    })),
    getUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockFetchUserSuccess)),
    })),
    confirmSignUp: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockConfirmSignupSuccess)),
    })),
  })),
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockConfirmSignupSuccess),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('index: Handler', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    cognitoLogin.handler(event).catch((error) => {
      expect(error).not.toBeUndefined();
      expect(error.message).not.toBeUndefined();
      expect(error.message).toMatch(/Unable to fetchuser from cognito/);
    });
  });
});
