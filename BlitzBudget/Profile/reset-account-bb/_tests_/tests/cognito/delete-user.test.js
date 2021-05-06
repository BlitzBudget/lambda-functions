const cognitoDeleteUser = require('../../../cognito/delete-user');
const mockRequest = require('../../fixtures/request/deleteAccount.json');

const cognitoIdentityServiceProvider = {
  adminDeleteUser: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve({})),
  })),
};

describe('adminDeleteUser', () => {
  const event = mockRequest;

  test('With Data: Success', async () => {
    const response = await cognitoDeleteUser.deleteCognitoAccount(
      event,
      cognitoIdentityServiceProvider,
    );
    expect(response).not.toBeUndefined();
    expect(cognitoIdentityServiceProvider.adminDeleteUser).toHaveBeenCalledTimes(1);
  });
});
