const Login = () => {};

const initiateAuth = (params, cognitoidentityserviceprovider) => new Promise((resolve, reject) => {
  cognitoidentityserviceprovider.initiateAuth(params, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
      reject(err);
    } else {
      console.log(data); // successful response
      resolve(data);
    }
  });
});

Login.prototype.initiateAuth = initiateAuth;

// Export object
module.exports = new Login();
