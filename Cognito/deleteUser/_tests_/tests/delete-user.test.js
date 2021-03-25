const cognitoDeleteUser = require('../../index');
const mockSuccess = require('../fixtures/response/success');
const mockRequest = require('../fixtures/request/deleteUser');

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
    const response = await cognitoDeleteUser.handler(event);
    expect(response).not.toBeUndefined();
    expect(response).not.toBeUndefined();
  });
});
