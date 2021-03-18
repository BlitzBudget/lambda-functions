const ConfirmForgotPassword = () => {};

ConfirmForgotPassword.confirmForgotPassword = async (
  params,
  cognitoidentityserviceprovider,
) => {
  const response = await cognitoidentityserviceprovider.confirmForgotPassword(params).promise();
  return response;
};

// Export object
module.exports = new ConfirmForgotPassword();
