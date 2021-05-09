const categoryParameter = require('../../../create-parameter/category');
const mockRequest = require('../../fixtures/request/addScheduledTransactions');

describe('categoryParameter: createParameter', () => {
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  test('With Data: Success', () => {
    const parameters = categoryParameter.createParameter(
      walletId,
      'sk',
      'categoryType',
      'categoryName',
      'dateMeantFor',
    );
    expect(parameters).not.toBeUndefined();
    expect(parameters.PutRequest).not.toBeUndefined();
    expect(parameters.PutRequest.Item).not.toBeUndefined();
    expect(parameters.PutRequest.Item.pk).toBe(walletId);
    expect(parameters.PutRequest.Item.sk).toBe('sk');
    expect(parameters.PutRequest.Item.category_name).toBe('categoryName');
    expect(parameters.PutRequest.Item.category_type).toBe('categoryType');
    expect(parameters.PutRequest.Item.date_meant_for).toBe('dateMeantFor');
  });
});
