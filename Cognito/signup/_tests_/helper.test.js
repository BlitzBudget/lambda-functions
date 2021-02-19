const helper = require('../helper');

describe('isEmpty', () => {
  test('With Data: Success', () => {
    expect(helper.isEmpty('en')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(helper.isEmpty('')).toBe(true);
    expect(helper.isEmpty(null)).toBe(true);
  });
});

describe('fetchFirstAndFamilyName', () => {
  test('With Special Characters', () => {
    const name = helper.fetchFirstAndFamilyName('nagarjun_nagesh');
    expect(name.familyName).toBe('Nagesh');
    expect(name.firstName).toBe('Nagarjun');
  });

  test('Without Special Characters', () => {
    const name = helper.fetchFirstAndFamilyName('nagarjunnagesh');
    expect(name.familyName).toBe(' ');
    expect(name.firstName).toBe('Nagarjunnagesh');
  });

  test('Special Characters in First Place: without family name', () => {
    const name = helper.fetchFirstAndFamilyName('_nagarjun');
    expect(name.familyName).toBe(' ');
    expect(name.firstName).toBe('Nagarjun');
  });

  test('Special Characters in First Place: with family name', () => {
    const name = helper.fetchFirstAndFamilyName('_nagarjun_nagesh');
    expect(name.familyName).toBe('Nagesh');
    expect(name.firstName).toBe('Nagarjun');
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

describe('splitElement', () => {
  test('With Split Character: Success', () => {
    const names = helper.splitElement('Nagarjun_Nagesh', '_');
    expect(names[0]).toBe('Nagarjun');
    expect(names[1]).toBe('Nagesh');
  });

  test('Without Split Character: Success', () => {
    const names = helper.splitElement('Nagarjun_Nagesh', '.');
    expect(names).toBe('Nagarjun_Nagesh');
  });

  test('Empty Data: Success', () => {
    const names = helper.splitElement('', '.');
    expect(names).toBe('');
  });

  test('Null Data: Success', () => {
    const names = helper.splitElement(null, '.');
    expect(names).toBe(null);
  });
});

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

describe('buildParamForSignup', () => {
  test('Build Param for signup', () => {
    const password = 'ABCD1234.';
    const email = 'nagarjun_nagesh@outlook.com';
    const firstName = 'Nagarjun';
    const params = helper.buildParamForSignup(
      password,
      email,
      firstName,
      'Nagesh',
      'en-US',
    );
    expect(params.Password).toBe(password);
    expect(params.Username).toBe(email);
    expect(params.UserAttributes[1].Value).toBe(firstName);
  });
});
