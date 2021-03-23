const cognitoFetchUserHelper = require('../../../utils/fetch-user-helper');
const mockSuccess = require('../../fixtures/response/fetchUser');
const mockRequest = require('../../fixtures/response/login');

const cognitoidentityserviceprovider = {
  getUser: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
  })),
};

describe('getUser', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await cognitoFetchUserHelper
      .fetchUserInformation(event, cognitoidentityserviceprovider);
    expect(response).not.toBeNull();
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
});
