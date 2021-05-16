const helper = require('../../../utils/helper');
const mockLogin = require('../../fixtures/response/login');
const mockGetUser = require('../../fixtures/response/get-user');
const mockWalletResponse = require('../../fixtures/response/wallet');

jest.mock('../../../fetch/wallet', () => ({
  getWallet: () => Promise.resolve(mockWalletResponse.Items),
}));

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn()
        .mockResolvedValueOnce({}),
    })),
  })),
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

describe('formulateResponse', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].password = '12345678';
  event['body-json'].username = 'nagarjun_nagesh@outlook.com';
  event['body-json'].checkPassword = false;

  test('With Data: Success', async () => {
    const response = await helper.formulateResponse(event);
    expect(response).not.toBeUndefined();
    expect(response.Username).not.toBeUndefined();
    expect(response.UserAttributes).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.ChallengeParameters).not.toBeUndefined();
  });

  test('With Data CheckPassword True: Success', async () => {
    event['body-json'].checkPassword = true;
    const response = await helper.formulateResponse(event);
    expect(response).not.toBeUndefined();
    expect(response.Username).not.toBeUndefined();
    expect(response.UserAttributes).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.AuthenticationResult).not.toBeUndefined();
    expect(response.ChallengeParameters).not.toBeUndefined();
  });
});
