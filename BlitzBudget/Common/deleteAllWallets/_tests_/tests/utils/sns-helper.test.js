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

describe('SNS publish without sk', () => {
  const eventsWithData = [];
  const mockRequestWithoutSk = {
    Items: [
      {
        pk: 'Category#1234',
      }],
  };

  const snsWithoutSk = {
    publish: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  };
  test('Success', async () => {
    await snsHelper
      .publishToSNS(mockRequestWithoutSk, snsWithoutSk, eventsWithData);
    expect(eventsWithData.length).toBe(0);
    expect(snsWithoutSk.publish).toHaveBeenCalledTimes(0);
  });
});
