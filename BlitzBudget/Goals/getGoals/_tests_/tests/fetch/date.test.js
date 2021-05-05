const fetchDate = require('../../../fetch/date');
const mockRequest = require('../../fixtures/request/getGoals.json');
const mockResponse = require('../../fixtures/response/fetch-date.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Date item', () => {
  test('Without Matching Date: Success', async () => {
    const response = await fetchDate
      .getDateData(mockRequest['body-json'].walletId, '2021', '2022', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
