const sesSend = require('../../../ses/send');
const mockRequest = require('../../fixtures/sendSampleEmail.json');

jest.mock('aws-sdk', () => ({
  SES: jest.fn(() => ({
    sendEmail: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
}));

describe('SES send', () => {
  test('Success', async () => {
    const response = await sesSend
      .sendEmail(mockRequest);
    expect(response).toBeUndefined();
  });
});
