const budgetExpression = require('../../../create-expression/goal');
const mockRequest = require('../../fixtures/request/patchGoals');

describe('budgetExpression: createExpression', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });

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
    expect(parameters.ExpressionAttributeValues[':u']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':v0']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':v2']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':v3']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#update']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#variable0']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#variable2']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#variable3']).not.toBeUndefined();
  });

  test('Without Data: Success', () => {
    event['body-json'] = undefined;
    const parameters = budgetExpression.createExpression(event);
    expect(parameters).toBeUndefined();
  });

  test('Without proper Data: Success', () => {
    event['body-json'] = {
      walletId: 'Wallet#2020-04-13',
    };
    const parameters = budgetExpression.createExpression(event);
    expect(parameters).toBeUndefined();
  });
});
