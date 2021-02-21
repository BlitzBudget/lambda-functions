const helper = require('../../../utils/helper');

describe('changePasswordParameters', () => {
  test('With Data: Success', () => {
    const parameters = helper.changePasswordParameters('accessToken', 'password', 'newPassword');
    expect(parameters).not.toBeNull();
    expect(parameters.AccessToken).not.toBeNull();
    expect(parameters.PreviousPassword).not.toBeNull();
    expect(parameters.ProposedPassword).not.toBeNull();
    expect(parameters.AccessToken).toBe('accessToken');
    expect(parameters.PreviousPassword).toBe('password');
    expect(parameters.ProposedPassword).toBe('newPassword');
  });
});
