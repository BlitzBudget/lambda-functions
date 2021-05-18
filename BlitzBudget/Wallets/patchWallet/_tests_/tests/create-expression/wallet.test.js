const walletExpression = require('../../../create-expression/wallet');
const mockRequest = require('../../fixtures/request/patchWallet');

describe('walletExpression: createExpression', () => {
  const event = mockRequest;

  test('With Data: Success', () => {
    const parameters = walletExpression.createExpression(event);
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
    expect(parameters.ExpressionAttributeNames).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#update']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeNames['#variable0']).not.toBeUndefined();
  });

  test('Without Wallet Data: Success', () => {
    event['body-json'] = undefined;
    const parameters = walletExpression.createExpression(event);
    expect(parameters).toBeUndefined();
  });

  test('Without Proper Parameters: Success', () => {
    const withoutParameter = {
      'body-json': {
        walletId: 'Wallet#123',
      },
    };
    const parameters = walletExpression.createExpression(withoutParameter);
    expect(parameters).toBeUndefined();
  });
});
