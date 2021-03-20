const helper = require('../../../utils/helper');

describe('fetchCurrencyInformation', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].confirmationCode = 'notempty';
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation('ES');
    expect(currencyChosen).not.toBeNull();
    expect(currencyChosen).toBe('Euro');
  });

  test('With Lowercase Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation('es');
    expect(currencyChosen).not.toBeNull();
    expect(currencyChosen).toBe('Euro');
  });

  test('With Empty Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation('');
    expect(currencyChosen).not.toBeNull();
    expect(currencyChosen).toBe('US Dollar');
  });

  test('With Null Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation();
    expect(currencyChosen).not.toBeNull();
    expect(currencyChosen).toBe('US Dollar');
    const nullCheck = helper.fetchCurrencyInformation(null);
    expect(nullCheck).not.toBeNull();
    expect(nullCheck).toBe('US Dollar');
  });
});
