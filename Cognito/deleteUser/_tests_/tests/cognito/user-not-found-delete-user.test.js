const mockUserNotFound = require('../../fixtures/response/userNotFoundException.json');
const mockRequest = require('../../fixtures/request/deleteUser.json');
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
      expect(response).not.toBeUndefined();
      expect(response.errorType).not.toBeUndefined();
      expect(response.errorMessage).not.toBeUndefined();
      expect(response.errorMessage).toMatch(/UserNotFoundException/);
    });
  });
});
