const resetAccount = require('../../index');
const mockRequest = require('../fixtures/request/sendSampleEmail.json');

jest.mock('aws-sdk', () => ({
  SES: jest.fn(() => ({
    sendEmail: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
}));

describe('Send Email', () => {
  const event = mockRequest;
  test('Without Wallet Data: Success', async () => {
    const response = await resetAccount
      .handler(event);
    expect(response).toBeUndefined();
  });
});
