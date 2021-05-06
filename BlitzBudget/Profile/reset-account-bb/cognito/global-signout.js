function GlobalSignout() {}
const globalSignoutParameter = require('../create-parameter/global-signout');

// Global Signout Before Deleting the User
async function globalSignoutFromAllDevices(event, cognitoIdServiceProvider) {
  const params = globalSignoutParameter.createParameter(event);

  const response = await cognitoIdServiceProvider.globalSignOut(params).promise();
  return response;
}

GlobalSignout.prototype.globalSignoutFromAllDevices = globalSignoutFromAllDevices;
// Export object
module.exports = new GlobalSignout();
