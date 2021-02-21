const helper = require('../utils/helper');

describe('isEmpty', () => {
  test('With Data: Success', () => {
    expect(helper.isEmpty('en')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(helper.isEmpty('')).toBe(true);
    expect(helper.isEmpty(null)).toBe(true);
  });
});

describe('isNotEmpty', () => {
  test('With Data: Success', () => {
    expect(helper.isNotEmpty('en')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(helper.isNotEmpty('')).toBe(false);
    expect(helper.isNotEmpty(null)).toBe(false);
  });
});

describe('isEqual', () => {
  test('With Data: Success', () => {
    expect(helper.isEqual('en', 'en')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(helper.isEqual('')).toBe(false);
    expect(helper.isEqual(null)).toBe(false);
    expect(helper.isEqual('', '')).toBe(true);
    expect(helper.isEqual(null, '')).toBe(false);
    expect(helper.isEqual('', null)).toBe(false);
  });

  test('False Data: Success', () => {
    expect(helper.isEqual('en', 'e')).toBe(false);
    expect(helper.isEqual(null, 'e')).toBe(false);
    expect(helper.isEqual('en', null)).toBe(false);
  });
});

describe('createLoginParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';
  event['body-json'].password = 'notempty';

  test('With Data: Success', () => {
    const parameters = helper.createLoginParameters(event);
    expect(parameters).not.toBeNull();
    expect(parameters.AuthFlow).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.AuthParameters).not.toBeNull();
    expect(parameters.AuthParameters.USERNAME).not.toBeNull();
    expect(parameters.AuthParameters.PASSWORD).not.toBeNull();
  });
});

describe('createConfirmSignupParameters', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].confirmationCode = 'notempty';
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = helper.createConfirmSignupParameters(event);
    expect(parameters).not.toBeNull();
    expect(parameters.ClientId).not.toBeNull();
    expect(parameters.ConfirmationCode).not.toBeNull();
    expect(parameters.Username).not.toBeNull();
  });
});

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
