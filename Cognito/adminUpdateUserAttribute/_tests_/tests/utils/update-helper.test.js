const mockRequest = require('.../../../fixtures/request/updateExportFileFormat.json');
const adminUpdateUser = require('../../../utils/update-helper');

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
    const response = await adminUpdateUser.updateUserAttributes(event);
    expect(response).toBeUndefined();
  });
});
