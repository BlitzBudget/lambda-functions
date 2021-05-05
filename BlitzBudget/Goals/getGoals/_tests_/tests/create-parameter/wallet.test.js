const walletParameter = require('../../../create-parameter/wallet');
const mockRequest = require('../../fixtures/request/getGoals.json');
const mockRequestyUserId = require('../../fixtures/request/byUserId.json');

describe('walletParameter: createParameter', () => {
  const event = mockRequest;
  test('With Data: Success', () => {
    const parameters = walletParameter.createParameter(
      mockRequestyUserId['body-json'].userId,
      event['body-json'].walletId,
    );
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.AttributesToGet).not.toBeUndefined();
    expect(parameters.Key).not.toBeUndefined();
    expect(parameters.Key.pk).not.toBeUndefined();
    expect(parameters.Key.sk).not.toBeUndefined();
  });
});

describe('walletParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = walletParameter.createParameterForUserID(mockRequestyUserId['body-json'].userId);
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.KeyConditionExpression).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':pk']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).not.toBeUndefined();
    expect(parameters.ExpressionAttributeValues[':items']).toBe('Wallet#');
    expect(parameters.ProjectionExpression).not.toBeUndefined();
  });
});
