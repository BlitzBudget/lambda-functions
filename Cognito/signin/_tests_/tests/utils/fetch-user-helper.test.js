const userHelper = require('../../../utils/fetch-user-helper');
const mockLogin = require('../../fixtures/response/login');
const mockUser = require('../../fixtures/response/get-user');

const cognitoidentityserviceprovider = {
  getUser: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(mockUser),
  })),
};

describe('getUser', () => {
  const event = mockLogin;

  test('With Data: Success', async () => {
    const response = await userHelper.fetchUserFromCognito(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response.UserAttributes).not.toBeUndefined();
    expect(response.UserAttributes).not.toBeUndefined();
    expect(response.Username).toBe(mockUser.UserAttributes[7].Value);
    expect(response.UserAttributes[0].Value).toBe(mockUser.UserAttributes[0].Value);
    expect(response.UserAttributes[1].Value).toBe(mockUser.UserAttributes[1].Value);
    expect(response.UserAttributes[2].Value).toBe(mockUser.UserAttributes[2].Value);
    expect(response.UserAttributes[3].Value).toBe(mockUser.UserAttributes[3].Value);
    expect(response.UserAttributes[4].Value).toBe(mockUser.UserAttributes[4].Value);
    expect(response.UserAttributes[5].Value).toBe(mockUser.UserAttributes[5].Value);
    expect(response.UserAttributes[6].Value).toBe(mockUser.UserAttributes[6].Value);
    expect(response.UserAttributes[7].Value).toBe(mockUser.UserAttributes[7].Value);
    expect(response.UserCreateDate).toBe(mockUser.UserCreateDate);
  });
});
