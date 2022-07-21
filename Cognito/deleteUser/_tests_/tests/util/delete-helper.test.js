const cognitoDeleteUser = require('../../../util/delete-helper');
const mockSuccess = require('../../fixtures/response/success.json');
const mockRequest = require('../../fixtures/request/deleteUser.json');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    deleteUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('handleDeleteUser', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoDeleteUser.handleDeleteUser(event);
    expect(response).not.toBeUndefined();
    expect(response).not.toBeUndefined();
  });
});
