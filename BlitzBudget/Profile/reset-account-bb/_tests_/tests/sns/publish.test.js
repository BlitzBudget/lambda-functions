const snsPublish = require('../../../sns/publish');
const mockRequest = require('../../fixtures/request/deleteAccount.json');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('SNS publish', () => {
  test('Success', async () => {
    const response = await snsPublish
      .resetAccountSubscriberThroughSNS(mockRequest, sns);
    expect(response).not.toBeUndefined();
    expect(sns.publish).toHaveBeenCalledTimes(1);
  });
});
