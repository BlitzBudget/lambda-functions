const budgetExpression = require('../../../create-expression/update-budget');
const mockRequest = require('../../fixtures/request/patchBudgets');

describe('budgetExpression: createExpression', () => {
  mockRequest['body-json'].categoryName = 'random';
  const event = mockRequest;

  test('With Data: Success', () => {
    const parameters = budgetExpression.createExpression(event);
    expect(parameters).not.toBeUndefined();
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.UpdateExpression).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.Key.pk).not.toBeUndefined();
    expect(parameters.Key.sk).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':c']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':p']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':q']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':r']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':s']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':u']).not.toBeUndefined();
  });
});
