const GlobalSignout = () => {};

// Global Signout Before Deleting the User
async function globalSignoutFromAllDevices(event, cognitoIdServiceProvider) {
  function createParameters() {
    return {
      AccessToken: event['body-json'].accessToken,
    };
  }

  const params = createParameters();

  const response = await cognitoIdServiceProvider.globalSignOut(params).promise();
  return response;
}

GlobalSignout.prototype.globalSignoutFromAllDevices = globalSignoutFromAllDevices;
// Export object
module.exports = new GlobalSignout();
