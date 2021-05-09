const walletHelper = require('../../../utils/wallet-helper');
const mockSuccess = require('../../fixtures/response/confirmSignup');
const mockRequest = require('../../fixtures/response/fetchUser');

const dynamoDB = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockSuccess),
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
});
