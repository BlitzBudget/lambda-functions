const dynamoAddNewWallet = require('../../../wallet/add-new-wallet');
const mockSuccess = require('../../fixtures/response/confirmSignup');
const mockRequest = require('../../fixtures/response/fetchUser');

const dynamoDB = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockSuccess),
  })),
};

describe('addNewWallet', () => {
  const event = mockRequest.UserAttributes;
  test('With Data: Success', async () => {
    const response = await dynamoAddNewWallet.addNewWallet(event, 'Euro', dynamoDB);
    expect(response).not.toBeUndefined();
  });
});
