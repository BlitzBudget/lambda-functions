const resetAccount = require('../../index');
const mockRequest = require('../fixtures/request/sendSampleEmail.json');

jest.mock('aws-sdk', () => ({
  SES: jest.fn(() => ({
    sendEmail: jest.fn(() => ({
      promise: jest.fn().mockRejectedValueOnce({}),
    })),
  })),
}));

describe('Send Email', () => {
  const event = mockRequest;
  test('Without Wallet Data: Success', async () => {
    await resetAccount
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
