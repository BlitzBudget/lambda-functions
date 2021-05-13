const updateTransactionParameter = require('../../../create-parameter/transaction');
const mockRequest = require('../../fixtures/request/patchTransactions');

describe('updateTransactionParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = updateTransactionParameter.createParameter(event, 'ue', 'ean', 'eav');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames).not.toBeUndefined();
  });
});
