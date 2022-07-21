const mockUserAttributeRequest = require('.../../../fixtures/request/updateUserAttributes.json');
const mockUserCurrencyRequest = require('.../../../fixtures/request/updateUserCurrency.json');
const familyNameParameter = require('../../../create-parameter/family-name');

describe('mockFamilyNameRequest', () => {
  const event = mockUserAttributeRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = familyNameParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(1);
    expect(parameter.UserAttributes).not.toBeUndefined();
    expect(parameter.UserAttributes[0]).not.toBeUndefined();
    expect(parameter.UserAttributes[0].Name).toBe('family_name');
  });
});

describe('mockFamilyNameRequest: False Data', () => {
  const event = mockUserCurrencyRequest;
  const parameter = { UserAttributes: [] };

  test('With Data: Success', () => {
    const index = familyNameParameter.createParameter(event, parameter, 0);
    expect(index).not.toBeUndefined();
    expect(index).toBe(0);
    expect(parameter.UserAttributes.length).toBe(0);
  });
});
