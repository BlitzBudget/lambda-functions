const mockUserNotFound = require('../../fixtures/response/userNotFoundException');
const mockRequest = require('../../fixtures/request/deleteUser');
const cognitoDeleteUser = require('../../../cognito/delete-user');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    deleteUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.reject(mockUserNotFound)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('handleDeleteUser: ERROR', () => {
  const event = mockRequest;
  test('With Data: ERROR', () => {
    cognitoDeleteUser.handleDeleteUser(event).catch((response) => {
      expect(response).not.toBeNull();
      expect(response.errorType).not.toBeUndefined();
      expect(response.errorMessage).not.toBeUndefined();
      expect(response.errorMessage).toMatch(/UserNotFoundException/);
    });
  });
});
