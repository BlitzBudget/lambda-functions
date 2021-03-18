const deleteUserParameter = require('../../../create-parameter/delete-user');

describe('createParameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].accessToken = 'notempty';

  test('With Data: Success', () => {
    const parameters = deleteUserParameter.createParameters(event);
    const accessToken = parameters.AccessToken;
    expect(accessToken).not.toBeNull();
  });
});
