const mockRequest = require('.../../../fixtures/request/updateExportFileFormat.json');
const adminUpdateUser = require('../../../utils/update-helper');

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    adminUpdateUserAttributes: jest.fn(() => ({
      promise: jest.fn()
        .mockRejectedValueOnce(mockRequest),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('index: Handler', () => {
  const event = mockRequest;
  test('With Data: Error', async () => {
    await adminUpdateUser.updateUserAttributes(event).catch((err) => {
      expect(err).not.toBeUndefined();
      expect(err.message).toMatch(/Unable to update the userattributes./);
    });
  });
});
