const budgetParameter = require('../../../create-parameter/update-budget');
const mockRequest = require('../../fixtures/request/patchBudgets');

describe('categoryParameter: createParameter', () => {
  mockRequest['body-json'].categoryName = 'random';
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = budgetParameter.createParameter(event, 'ue', 'ean', 'eav');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.Key.pk).not.toBeUndefined();
    expect(parameters.Key.sk).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
  });
});
