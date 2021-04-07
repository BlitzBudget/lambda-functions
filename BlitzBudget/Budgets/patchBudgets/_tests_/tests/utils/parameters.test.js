const parameters = require('../../../utils/parameters');

describe('parameters:', () => {
  test('With Data: Success', () => {
    expect(parameters).not.toBeUndefined();
    expect(parameters[0].prmName).not.toBeUndefined();
    expect(parameters[0].prmValue).not.toBeUndefined();
    expect(parameters[1].prmValue).not.toBeUndefined();
    expect(parameters[1].prmValue).not.toBeUndefined();
  });
});
