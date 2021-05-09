const resetHelper = require('../../../utils/reset-helper');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
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
});
