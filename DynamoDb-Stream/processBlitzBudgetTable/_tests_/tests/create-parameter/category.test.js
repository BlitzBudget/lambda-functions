const categoryParameter = require('../../../create-parameter/category');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable');

describe('categoryParameter: createParameter', () => {
  const event = mockRequest;
  const walletId = event.Records[0].dynamodb.NewImage.pk.S;
  test('With Data: Success', () => {
    const parameters = categoryParameter.createParameter(
      walletId,
      'sk',
      'differnce',
    );
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Key.pk).not.toBeUndefined();
    expect(parameters.Key.sk).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.ConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':ab']).not.toBeUndefined();
    expect(parameters.ReturnValues).not.toBeUndefined();
  });
});
