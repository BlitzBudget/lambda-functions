module.exports.confirmForgotPassword = async (
  params,
  cognitoidentityserviceprovider,
) => {
  const response = await cognitoidentityserviceprovider.confirmForgotPassword(params).promise();
  return response;
};
