const signupParameter = require('../../create-parameter/signup');

describe('buildParamForSignup', () => {
  test('Build Param for signup', () => {
    const password = 'ABCD1234.';
    const email = 'nagarjun_nagesh@outlook.com';
    const firstName = 'Nagarjun';
    const params = signupParameter.createParameter(
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
