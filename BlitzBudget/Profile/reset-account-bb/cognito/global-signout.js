const GlobalSignout = () => {};

// Global Signout Before Deleting the User
function globalSignoutFromAllDevices(event, cognitoIdServiceProvider) {
  function createParameters() {
    return {
      AccessToken: event['body-json'].accessToken,
    };
  }

  const params = createParameters();

  return new Promise((resolve, reject) => {
    cognitoIdServiceProvider.globalSignOut(params, (err) => {
      if (err) {
        console.log(
          'Unable to signout the user globally %j',
          params.Usename,
        );
        reject(err); // an error occurred
      } else {
        console.log(
          'Successfully signout the user globally %j',
          params.Usename,
        );
        resolve('Global Signout Successful'); // successful response
      }
    });
  });
}

GlobalSignout.prototype.globalSignoutFromAllDevices = globalSignoutFromAllDevices;
// Export object
module.exports = new GlobalSignout();
