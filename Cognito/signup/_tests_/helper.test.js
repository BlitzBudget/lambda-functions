const helper = require('../helper');

describe( 'IsEmpty', () => {
  test('With Data: Success', () => {
    expect(helper.isEmpty("en")).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(helper.isEmpty("")).toBe(true);
    expect(helper.isEmpty(null)).toBe(true);
  });
});