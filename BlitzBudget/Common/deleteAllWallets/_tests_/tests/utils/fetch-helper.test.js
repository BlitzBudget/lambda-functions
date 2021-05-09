const fetchItems = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/deleteAllWallets.json');
const mockResponse = require('../../fixtures/response/fetchResponse.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Fetch Helper Without Data', () => {
  const documentClientWithoutData = {
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({ Items: {}, Count: 0 }),
    })),
  };

  const events = [];

  test('Success', async () => {
    await fetchItems
      .fetchAllItemsToDelete(
        mockRequest.Records[0].Sns.Message, sns, documentClientWithoutData, events,
      );
    expect(events).not.toBeUndefined();
    expect(events.length).toBe(0);
    expect(sns.publish).toHaveBeenCalledTimes(0);
    expect(documentClientWithoutData.query).toHaveBeenCalledTimes(1);
  });
});

describe('Fetch Helper', () => {
  const events = [];

  test('Success', async () => {
    await fetchItems
      .fetchAllItemsToDelete(mockRequest.Records[0].Sns.Message, sns, documentClient, events);
    expect(events).not.toBeUndefined();
    expect(events.length).toBe(2);
    expect(sns.publish).toHaveBeenCalledTimes(2);
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
