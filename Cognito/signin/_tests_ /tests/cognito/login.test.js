const cognitoLogin = require('../../../cognito/login');
const mockLogin = require('../../fixtures/response/login');
const mockNotConfirmed = require('../../fixtures/response/user_not_confirmed_exception');
const mockNotAuthorized = require('../../fixtures/response/not_authorized_exception');
const mockUserNotFound = require('../../fixtures/response/user_not_found_exception');

let cognitoidentityserviceprovider = {
  initiateAuth: jest.fn(() => ({
    promise: jest.fn()
      .mockResolvedValueOnce(mockLogin),
  })),
};

describe('initiateAuth', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].password = '12345678';
  event['body-json'].username = 'nagarjun_nagesh@outlook.com';

  test('With Data: Success', async () => {
    const response = await cognitoLogin.initiateAuth(event, cognitoidentityserviceprovider);
    expect(response).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.AuthenticationResult.RefreshToken).not.toBeUndefined();
  });

  test('User Not Authorized: Error', () => {
    cognitoidentityserviceprovider = {
      initiateAuth: jest.fn(() => ({
        promise: jest.fn()
          .mockReturnValueOnce(Promise.reject(mockNotAuthorized)),
      })),
    };

    return cognitoLogin.initiateAuth(event, cognitoidentityserviceprovider).catch((error) => {
      expect(error).not.toBeUndefined();
      expect(error.errorType).not.toBeUndefined();
      expect(error.errorMessage).toContain('NotAuthorizedException');
    });
  });

  test('User Not Confirmed: Error', () => {
    cognitoidentityserviceprovider = {
      initiateAuth: jest.fn(() => ({
        promise: jest.fn()
          .mockReturnValueOnce(Promise.reject(mockNotConfirmed)),
      })),
    };

    return cognitoLogin.initiateAuth(event, cognitoidentityserviceprovider).catch((error) => {
      expect(error).not.toBeUndefined();
      expect(error.errorType).not.toBeUndefined();
      expect(error.errorMessage).toContain('UserNotConfirmedException');
    });
  });

  test('User Not Found: Error', () => {
    cognitoidentityserviceprovider = {
      initiateAuth: jest.fn(() => ({
        promise: jest.fn()
          .mockReturnValueOnce(Promise.reject(mockUserNotFound)),
      })),
    };

    return cognitoLogin.initiateAuth(event, cognitoidentityserviceprovider).catch((error) => {
      expect(error).not.toBeUndefined();
      expect(error.errorType).not.toBeUndefined();
      expect(error.errorMessage).toContain('UserNotFoundException');
    });
  });
});
