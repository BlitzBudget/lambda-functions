const helper = require('../../../utils/helper');

describe('emailToLowerCase', () => {
  const event = {};
  event['body-json'] = {};

  test('With Empty Space: Success', () => {
    expect(helper.emailToLowerCase(' nagarjun_nagesh@outlook.com ')).toBe(
      'nagarjun_nagesh@outlook.com',
    );
  });

  test('With Uppercase: Success', () => {
    expect(helper.emailToLowerCase('Nagarjun_Nagesh@outlook.com')).toBe(
      'nagarjun_nagesh@outlook.com',
    );
  });

  test('Without Uppercase && Without Space: Success', () => {
    expect(helper.emailToLowerCase('nagarjun_nagesh@outlook.com ')).toBe(
      'nagarjun_nagesh@outlook.com',
    );
  });

  test('With Uppercase && With Space: Success', () => {
    expect(helper.emailToLowerCase(' nagaRjuN_NagEsh@outloOk.cOM ')).toBe(
      'nagarjun_nagesh@outlook.com',
    );
  });
});

describe('extractFirstAndLastName', () => {
  test('With Firstname and Lastname: Success', () => {
    const { username, surname } = helper.extractFirstAndLastName(
      'Nagarjun',
      'Nagesh',
      null,
    );
    expect(username).toBe('Nagarjun');
    expect(surname).toBe('Nagesh');
  });

  test('Without Firstname and Lastname: Success', () => {
    const { username, surname } = helper.extractFirstAndLastName(
      null,
      null,
      'nagarjun_nagesh@outlook.com',
    );
    expect(username).toBe('Nagarjun');
    expect(surname).toBe('Nagesh');
  });

  test('Without Firstname and with Lastname: Success', () => {
    const { username, surname } = helper.extractFirstAndLastName(
      null,
      'ABCD',
      'nagarjun_nagesh@outlook.com',
    );
    expect(username).toBe('Nagarjun');
    expect(surname).toBe('Nagesh');
  });

  test('With Firstname and without Lastname: Success', () => {
    const { username, surname } = helper.extractFirstAndLastName(
      null,
      'ABCD',
      'nagarjun_nagesh@outlook.com',
    );
    expect(username).toBe('Nagarjun');
    expect(surname).toBe('Nagesh');
  });
});
