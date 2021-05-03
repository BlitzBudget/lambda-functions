const snsPublish = require('../../../sns/publish');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('SNS publish', () => {
  test('Success', async () => {
    const response = await snsPublish
      .publishToResetAccountsSNS('item', sns);
    expect(response).not.toBeUndefined();
    expect(sns.publish).toHaveBeenCalledTimes(1);
  });
});
