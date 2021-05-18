const fetchBankParameter = require('../../../create-parameter/account');

describe('fetchBankParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = fetchBankParameter.createParameter('pk', 'sk', 'balance');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':ab']).not.toBeUndefined();
    expect(parameters.ReturnValues).not.toBeUndefined();
  });
});
