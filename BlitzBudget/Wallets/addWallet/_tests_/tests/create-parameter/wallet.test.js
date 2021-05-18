const walletParameter = require('../../../create-parameter/wallet');

describe('transactionParameter: createParameter', () => {
  test('With Data: Success', () => {
    const parameters = walletParameter.createParameter('userId', 'randomValue', 'chosenCurrency', 'walletName');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Item).not.toBeUndefined();
    expect(parameters.Item.pk).not.toBeUndefined();
    expect(parameters.Item.sk).not.toBeUndefined();
    expect(parameters.Item.currency).not.toBeUndefined();
    expect(parameters.Item.wallet_name).not.toBeUndefined();
    expect(parameters.Item.wallet_balance).not.toBeUndefined();
    expect(parameters.Item.total_asset_balance).not.toBeUndefined();
    expect(parameters.Item.total_debt_balance).not.toBeUndefined();
    expect(parameters.Item.creation_date).not.toBeUndefined();
    expect(parameters.Item.updated_date).not.toBeUndefined();
  });
});
