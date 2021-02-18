const ConfirmSignup = () => {};

ConfirmSignup.prototype.confirmSignUp = (
  params,
  cognitoidentityserviceprovider,
) => new Promise((resolve, reject) => {
  cognitoidentityserviceprovider.confirmSignUp(params, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
      reject(err);
    } else {
      console.log(data); // successful response
      resolve(data);
    }
  });
});

module.exports = new ConfirmSignup();
