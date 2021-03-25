const fetchHelper = require('../../../utils/fetch-helper');
const mockSuccess = require('../../fixtures/response/success');
const mockUserAttributes = require('../../fixtures/request/getUserAttributes');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    adminGetUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockSuccess)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('fetchUser', () => {
  const event = mockUserAttributes;

  test('With Data: Success', async () => {
    const response = await fetchHelper.fetchUser(event);
    expect(response).not.toBeUndefined();
    expect(response.UserAttributes).not.toBeUndefined();
    expect(response.Username).toBe(mockSuccess.UserAttributes[7].Value);
    expect(response.UserAttributes[0].Value).toBe(mockSuccess.UserAttributes[0].Value);
    expect(response.UserAttributes[1].Value).toBe(mockSuccess.UserAttributes[1].Value);
    expect(response.UserAttributes[2].Value).toBe(mockSuccess.UserAttributes[2].Value);
    expect(response.UserAttributes[3].Value).toBe(mockSuccess.UserAttributes[3].Value);
    expect(response.UserAttributes[4].Value).toBe(mockSuccess.UserAttributes[4].Value);
    expect(response.UserAttributes[5].Value).toBe(mockSuccess.UserAttributes[5].Value);
    expect(response.UserAttributes[6].Value).toBe(mockSuccess.UserAttributes[6].Value);
    expect(response.UserAttributes[7].Value).toBe(mockSuccess.UserAttributes[7].Value);
    expect(response.UserCreateDate).toBe(mockSuccess.UserCreateDate);
  });
});
