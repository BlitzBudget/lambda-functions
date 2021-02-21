const helper = require('../helper');

describe('includesStr', () => {
  test('With Data: Success', () => {
    expect(helper.includesStr(['en', 'es'], 'es')).toBe(true);
    expect(helper.includesStr('falstru', 'tru')).toBe(true);
    expect(helper.includesStr('falstru', 'tr')).toBe(true);
  });

  test('With False Data: Success', () => {
    expect(helper.includesStr(['en', 'es'], 'e')).toBe(false);
    expect(helper.includesStr(['false', 'true'], 'tru')).toBe(false);
    expect(helper.includesStr(['fals', 'tru'], 'true')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(helper.includesStr(['en', 'es'], '')).toBe(false);
    expect(helper.includesStr([], 'en')).toBe(false);
  });
});
