const cognitoFetchUserHelper = require('../../../utils/fetch-user-helper');
const mockSuccess = require('../../fixtures/response/fetchUser.json');
const mockRequest = require('../../fixtures/response/login.json');

const cognitoidentityserviceprovider = {
  getUser: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(mockSuccess),
  })),
};

const cognitoidentityserviceproviderError = {
  getUser: jest.fn(() => ({
    promise: jest.fn()
      .mockRejectedValueOnce(mockSuccess),
  })),
};

describe('getUser', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoFetchUserHelper
      .fetchUser(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response.Username).not.toBeUndefined();
    expect(response.UserAttributes[0].Value).not.toBeUndefined();
    expect(response.UserAttributes[1].Value).not.toBeUndefined();
    expect(response.UserAttributes[2].Value).not.toBeUndefined();
    expect(response.UserAttributes[3].Value).not.toBeUndefined();
    expect(response.UserAttributes[4].Value).not.toBeUndefined();
    expect(response.UserAttributes[5].Value).not.toBeUndefined();
    expect(response.UserAttributes[6].Value).not.toBeUndefined();
    expect(response.UserAttributes[7].Value).not.toBeUndefined();
  });

  test('With Data: Error', async () => {
    await cognitoFetchUserHelper
      .fetchUser(event, cognitoidentityserviceproviderError).catch((err) => {
        expect(err).not.toBeUndefined();
        expect(err.message).toMatch(/Unable to get user attributes from cognito/);
      });
  });
});
