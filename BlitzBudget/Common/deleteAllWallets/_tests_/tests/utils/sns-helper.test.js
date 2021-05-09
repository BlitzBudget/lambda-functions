const snsHelper = require('../../../utils/sns-helper');
const mockRequest = require('../../fixtures/response/fetchResponse.json');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('SNS publish', () => {
  const events = [];
  test('Success', async () => {
    await snsHelper
      .publishToSNS({ Items: {}, Count: 0 }, sns, events);
    expect(events.length).toBe(0);
    expect(sns.publish).toHaveBeenCalledTimes(0);
  });
});

describe('SNS publish with data', () => {
  const eventsWithData = [];
  test('Success', async () => {
    await snsHelper
      .publishToSNS(mockRequest, sns, eventsWithData);
    expect(eventsWithData.length).toBe(2);
    expect(sns.publish).toHaveBeenCalledTimes(2);
  });
});
