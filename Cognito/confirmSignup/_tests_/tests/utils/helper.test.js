const helper = require('../../../utils/helper');
const mockFetchUser = require('../../fixtures/response/fetchUser.json');

describe('fetchCurrencyInformation', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].confirmationCode = 'notempty';
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation('ES');
    expect(currencyChosen).not.toBeUndefined();
    expect(currencyChosen).toBe('Euro');
  });

  test('With Lowercase Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation('es');
    expect(currencyChosen).not.toBeUndefined();
    expect(currencyChosen).toBe('Euro');
  });

  test('With Empty Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation('');
    expect(currencyChosen).not.toBeUndefined();
    expect(currencyChosen).toBe('US Dollar');
  });

  test('With Null Data: Success', () => {
    const currencyChosen = helper.fetchCurrencyInformation();
    expect(currencyChosen).not.toBeUndefined();
    expect(currencyChosen).toBe('US Dollar');
    const nullCheck = helper.fetchCurrencyInformation(null);
    expect(nullCheck).not.toBeUndefined();
    expect(nullCheck).toBe('US Dollar');
  });
});

describe('fetchUserId', () => {
  const event = mockFetchUser.UserAttributes;

  test('With Data: Success', () => {
    const userId = helper.fetchUserId(event);
    expect(userId).not.toBeUndefined();
    expect(userId).toBe(mockFetchUser.UserAttributes[2].Value);
  });

  test('With Empty Array: Success', () => {
    const userId = helper.fetchUserId({});
    expect(userId).toBeUndefined();
  });

  test('With Empty Data: Success', () => {
    const userId = helper.fetchUserId(mockFetchUser.Username);
    expect(userId).toBeUndefined();
  });
});
