const handle = require('../../index');
const mockLogin = require('../fixtures/response/login');
const mockGetUser = require('../fixtures/response/get-user');
const mockRequest = require('../fixtures/request/signin');
const mockWalletResponse = require('../fixtures/response/wallet');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn().mockResolvedValueOnce({}),
    })),
  },
  config: {
    update: jest.fn(),
  },
  CognitoIdentityServiceProvider: jest.fn(() => ({
    initiateAuth: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(mockLogin),
    })),
    getUser: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(mockGetUser),
    })),
  })),
}));

jest.mock('../../fetch/wallet', () => ({
  getWallet: () => Promise.resolve(mockWalletResponse.Items),
}));

describe('signupUser', () => {
  const event = mockRequest;
  test('With Data: Success', () => handle.handler(event).then((response) => {
    expect(response).not.toBeUndefined();
    expect(response.Username).not.toBeUndefined();
    expect(response.UserAttributes).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.ChallengeParameters).not.toBeUndefined();
  }));
});
