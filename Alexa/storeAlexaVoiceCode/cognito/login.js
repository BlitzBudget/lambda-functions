const Login = () => {};

/*
 * Admin initiate authentication
 */
function adminInitiateAuth(params, cognitoidentityserviceprovider) {
  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.adminInitiateAuth(
      params,
      (err, data) => {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        } else {
          console.log(data); // successful response
          resolve(data);
        }
      },
    );
  });
}

Login.prototype.adminInitiateAuth = adminInitiateAuth;
// Export object
module.exports = new Login();
