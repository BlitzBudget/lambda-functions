const FetchUser = () => {};

FetchUser.prototype.getUser = (response, cognitoidentityserviceprovider) => {
  const params = {
    AccessToken: response.AuthenticationResult.AccessToken /* required */,
  };

  return new Promise((resolve, reject) => {
    cognitoidentityserviceprovider.getUser(params, (err, data) => {
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

module.exports = new FetchUser();
