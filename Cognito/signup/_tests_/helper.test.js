const helper = require('../helper');

describe( 'isEmpty', () => {
  test('With Data: Success', () => {
    expect(helper.isEmpty("en")).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(helper.isEmpty("")).toBe(true);
    expect(helper.isEmpty(null)).toBe(true);
  });
});


describe( 'fetchFirstAndFamilyName', () => {
  test('With Special Characters', () => {
    let name = helper.fetchFirstAndFamilyName("nagarjun_nagesh");
    expect(name.familyName).toBe("Nagesh");
    expect(name.firstName).toBe("Nagarjun");
  });

  test('Without Special Characters', () => {
    let name = helper.fetchFirstAndFamilyName("nagarjunnagesh");
    expect(name.familyName).toBe(" ");
    expect(name.firstName).toBe("Nagarjunnagesh");
  });

  test('Special Characters in First Place: without family name', () => {
    let name = helper.fetchFirstAndFamilyName("_nagarjun");
    expect(name.familyName).toBe(" ");
    expect(name.firstName).toBe("Nagarjun");
  });

  test('Special Characters in First Place: with family name', () => {
    let name = helper.fetchFirstAndFamilyName("_nagarjun_nagesh");
    expect(name.familyName).toBe("Nagesh");
    expect(name.firstName).toBe("Nagarjun");
  });
});