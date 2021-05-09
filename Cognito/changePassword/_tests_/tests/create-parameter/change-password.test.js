const helper = require('../../../create-parameter/change-password');

describe('changePasswordParameters', () => {
  test('With Data: Success', () => {
    const parameters = helper.createParameter('accessToken', 'password', 'newPassword');
    expect(parameters).not.toBeUndefined();
    expect(parameters.AccessToken).not.toBeUndefined();
    expect(parameters.PreviousPassword).not.toBeUndefined();
    expect(parameters.ProposedPassword).not.toBeUndefined();
    expect(parameters.AccessToken).toBe('accessToken');
    expect(parameters.PreviousPassword).toBe('password');
    expect(parameters.ProposedPassword).toBe('newPassword');
  });
});
