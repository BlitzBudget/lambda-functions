const walletParameter = require('../../../create-parameter/wallet');
const constants = require('../../../constants/constant');

describe('Wallet Parameter', () => {
  const USER_ID = 'User#2020-12-21T20:32:06.003Z';
  test('Build Param for signup', () => {
    const parameters = walletParameter.createParameter(USER_ID);
    expect(parameters.TableName).toBe(constants.TABLE_NAME);
    expect(parameters.KeyConditionExpression).toBe(constants.KEY_CONDITION_EXPRESSION);
    expect(parameters.ExpressionAttributeValues[':userId']).toBe(USER_ID);
    expect(parameters.ExpressionAttributeValues[':items']).toBe(constants.WALLET_ID_PREFIX);
    expect(parameters.ProjectionExpression).toBe(constants.PROPERTIES_TO_FETCH);
  });
});
