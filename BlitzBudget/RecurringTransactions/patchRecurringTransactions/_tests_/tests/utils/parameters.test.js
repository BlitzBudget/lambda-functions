const parameters = require('../../../utils/parameters');

describe('parameters:', () => {
  test('With Data: Success', () => {
    expect(parameters).not.toBeUndefined();
    expect(parameters[0].prmName).not.toBeUndefined();
    expect(parameters[0].prmValue).toBe('amount');
    expect(parameters[1].prmValue).not.toBeUndefined();
    expect(parameters[1].prmValue).toBe('description');
    expect(parameters[2].prmName).not.toBeUndefined();
    expect(parameters[2].prmValue).toBe('category');
    expect(parameters[3].prmName).not.toBeUndefined();
    expect(parameters[3].prmValue).toBe('recurrence');
    expect(parameters[4].prmName).not.toBeUndefined();
    expect(parameters[4].prmValue).toBe('account');
    expect(parameters[5].prmName).not.toBeUndefined();
    expect(parameters[5].prmValue).toBe('tags');
  });
});
