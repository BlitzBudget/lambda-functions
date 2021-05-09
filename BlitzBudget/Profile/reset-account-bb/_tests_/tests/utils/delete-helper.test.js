const deleteHelper = require('../../../utils/delete-helper');
const mockRequest = require('../../fixtures/request/deleteAccount.json');
const mockRequestWithoutDelete = require('../../fixtures/request/resetAccountCall.json');

const cognitoIdentityServiceProvider = {
  adminDeleteUser: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve({})),
  })),
  globalSignOut: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve({})),
  })),
};

describe('handleDeleteAccount', () => {
  test('Without Delete User Data: Success', async () => {
    const responseWithEvents = await deleteHelper
      .handleDeleteAccount(
        mockRequestWithoutDelete,
        cognitoIdentityServiceProvider,
      );

    expect(responseWithEvents).not.toBeUndefined();
    expect(responseWithEvents.length).toBe(0);
    expect(cognitoIdentityServiceProvider.adminDeleteUser).toHaveBeenCalledTimes(0);
    expect(cognitoIdentityServiceProvider.globalSignOut).toHaveBeenCalledTimes(0);
  });

  test('With Delete User Data: Success', async () => {
    const responseWithEvents = await deleteHelper
      .handleDeleteAccount(
        mockRequest,
        cognitoIdentityServiceProvider,
      );

    expect(responseWithEvents).not.toBeUndefined();
    expect(responseWithEvents.length).toBe(2);
    expect(cognitoIdentityServiceProvider.adminDeleteUser).toHaveBeenCalledTimes(1);
    expect(cognitoIdentityServiceProvider.globalSignOut).toHaveBeenCalledTimes(1);
  });
});
