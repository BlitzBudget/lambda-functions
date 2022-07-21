const walletHelper = require('../../../utils/wallet-helper');
const mockSuccess = require('../../fixtures/response/confirmSignup.json');
const mockRequest = require('../../fixtures/response/fetchUser.json');

const dynamoDB = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockSuccess),
  })),
};

const dynamoDBError = {
  put: jest.fn(() => ({
    promise: jest.fn().mockRejectedValueOnce(mockSuccess),
  })),
};

describe('addNewWallet', () => {
  const event = mockRequest;

  test('Do Not Create A Wallet: Success', async () => {
    const response = await walletHelper.addNewWallet(event, true, 'ES', dynamoDB);
    expect(response).not.toBeUndefined();
    expect(response.Wallet).toBeUndefined();
  });

  test('With Data: Success', async () => {
    const response = await walletHelper.addNewWallet(event, false, 'ES', dynamoDB);
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
  });

  test('With Data: Error', async () => {
    await walletHelper.addNewWallet(event, false, 'ES', dynamoDBError)
      .catch((err) => {
        expect(err).not.toBeUndefined();
        expect(err.message).toMatch(/Unable to add new wallet/);
      });
  });
});
