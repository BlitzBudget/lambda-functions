const cognitoGlobalSignout = require('../../../cognito/global-signout');
const mockRequest = require('../../fixtures/request/deleteAccount.json');

const cognitoIdentityServiceProvider = {
  globalSignOut: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve({})),
  })),
};

describe('globalSignOut', () => {
  const event = mockRequest;

  test('With Data: Success', async () => {
    const response = await cognitoGlobalSignout.globalSignoutFromAllDevices(
      event,
      cognitoIdentityServiceProvider,
    );
    expect(response).not.toBeUndefined();
    expect(cognitoIdentityServiceProvider.globalSignOut).toHaveBeenCalledTimes(1);
  });
});
