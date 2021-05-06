const fetchDate = require('../../../fetch/date');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');
const mockResponse = require('../../fixtures/response/fetch-date.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

const documentClientEmptyResponse = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({
      Count: 0,
    }),
  })),
};

describe('Fetch Date item', () => {
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;

  test('With Date: Success', async () => {
    const response = await fetchDate
      .getDateData(walletId, '2021-03-15', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });

  test('With Empty Response: Success', async () => {
    const response = await fetchDate
      .getDateData(walletId, '2021-03-15', documentClientEmptyResponse);
    expect(response).not.toBeUndefined();
    expect(response.dateToCreate).not.toBeUndefined();
    expect(documentClientEmptyResponse.query).toHaveBeenCalledTimes(1);
  });
});
