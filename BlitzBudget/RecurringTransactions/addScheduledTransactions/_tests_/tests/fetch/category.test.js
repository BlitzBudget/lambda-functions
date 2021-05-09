const fetchCategory = require('../../../fetch/category');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');
const mockResponse = require('../../fixtures/response/fetch-category.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Category item', () => {
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const categoryType = event.Records[0].Sns.MessageAttributes.amount.Value;
  const categoryName = event.Records[0].Sns.MessageAttributes.description.Value;
  const category = event.Records[0].Sns.MessageAttributes.category.Value;
  test('Without Matching Category: Success', async () => {
    const response = await fetchCategory
      .getCategoryData(walletId, '2021-03-15', categoryType, categoryName, category, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.dateMeantFor).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
