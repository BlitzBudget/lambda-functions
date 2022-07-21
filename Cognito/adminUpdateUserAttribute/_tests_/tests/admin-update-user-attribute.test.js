const adminUpdateUser = require('../../index');
const mockRequest = require('../fixtures/request/updateExportFileFormat.json');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    adminUpdateUserAttributes: jest.fn(() => ({
      promise: jest.fn()
        .mockResolvedValueOnce(Promise.resolve(mockRequest)),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('index: Handler', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await adminUpdateUser.handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].exportFileFormat).not.toBeUndefined();
    expect(response['body-json'].username).not.toBeUndefined();
  });
});
