const ConfirmForgotPassword = () => {};

ConfirmForgotPassword.confirmForgotPassword = (
  params,
  cognitoidentityserviceprovider,
) => new Promise((resolve, reject) => {
  cognitoidentityserviceprovider.confirmForgotPassword(
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

// Export object
module.exports = new ConfirmForgotPassword();
