const localeParameter = require('../../../create-parameter/locale');
const mockUserLocaleRequest = require('.../../../fixtures/request/updateUserLocale');
const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency');

describe('mockLocaleRequest', () => {
  const event = mockUserLocaleRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = localeParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(1);
    expect(parameter.UserAttributes).not.toBeUndefined();
    expect(parameter.UserAttributes[0]).not.toBeUndefined();
    expect(parameter.UserAttributes[0].Name).toBe('locale');
  });
});

describe('mockLocaleRequest: False Data', () => {
  const event = mockUserCurrencyRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = localeParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(0);
    expect(parameter.UserAttributes.length).toBe(0);
  });
});
