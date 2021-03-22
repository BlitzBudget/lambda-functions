const walletParameter = require('../../../create-parameter/wallet');

describe('createWalletParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';
  event['body-json'].password = 'notempty';

  test('With Data: Success', () => {
    const parameters = walletParameter.createParameter(event, 'randomvalue', 'Euro');
    expect(parameters).not.toBeUndefined();
    expect(parameters.TableName).not.toBeUndefined();
    expect(parameters.Item.pk).not.toBeUndefined();
    expect(parameters.Item.sk).not.toBeUndefined();
    expect(parameters.Item.currency).not.toBeUndefined();
    expect(parameters.Item.wallet_balance).not.toBeUndefined();
  });
});
