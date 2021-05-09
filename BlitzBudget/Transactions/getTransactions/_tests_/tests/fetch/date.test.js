const fetchDate = require('../../../fetch/date');
const mockRequest = require('../../fixtures/request/getTransactions.json');
const mockResponse = require('../../fixtures/response/fetchDate.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Date item', () => {
  const event = mockRequest;

  test('With Date: Success', async () => {
    const response = await fetchDate
      .getDateData(event, '2021-03-15', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
