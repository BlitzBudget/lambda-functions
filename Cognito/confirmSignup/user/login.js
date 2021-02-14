var login = function () {};

login.prototype.initiateAuth = (params, cognitoidentityserviceprovider) => {
  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.initiateAuth(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
      } else {
        console.log(data); // successful response
        resolve(data);
      }
    });
  });
};

module.exports = new login();
