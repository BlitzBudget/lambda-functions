const resetHelper = require('../../../utils/reset-helper');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

const snsWithError = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockRejectedValueOnce({}),
  })),
};

describe('SNS publish', () => {
  test('Success: fromSNS False', async () => {
    const response = await resetHelper
      .resetAccount(false, 'sk', sns);
    expect(response).toBeUndefined();
    expect(sns.publish).toHaveBeenCalledTimes(0);
  });

  test('Success', async () => {
    const response = await resetHelper
      .resetAccount(true, 'sk', sns);
    expect(response).toBeUndefined();
    expect(sns.publish).toHaveBeenCalledTimes(1);
  });

  test('Error', async () => {
    await resetHelper
      .resetAccount(true, 'sk', snsWithError).catch((err) => {
        expect(err).not.toBeUndefined();
        expect(err.message).toMatch(/Unable to delete the item/);
      });
    expect(snsWithError.publish).toHaveBeenCalledTimes(1);
  });
});
