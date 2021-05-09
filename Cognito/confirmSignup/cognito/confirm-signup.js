function ConfirmSignup() {}

ConfirmSignup.prototype.confirmSignUp = async (params, cognitoidentityserviceprovider) => {
  const response = await cognitoidentityserviceprovider.confirmSignUp(params).promise();
  return response;
};

module.exports = new ConfirmSignup();
