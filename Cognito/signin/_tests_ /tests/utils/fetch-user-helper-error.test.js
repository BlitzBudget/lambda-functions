const userHelper = require('../../../utils/fetch-user-helper');
const mockLogin = require('../../fixtures/response/login');
const mockUser = require('../../fixtures/response/get-user');

const cognitoidentityserviceprovider = {
  getUser: jest.fn(() => ({
    promise: jest.fn()
      .mockRejectedValueOnce(mockUser),
  })),
};

describe('getUser', () => {
  const event = mockLogin;

  test('With Data: Success', async () => {
    await userHelper.fetchUserFromCognito(event, cognitoidentityserviceprovider).catch((err) => {
      expect(err).not.toBeUndefined();
      expect(err.message).toMatch(/Unable to signin from cognito/);
    });
  });
});
