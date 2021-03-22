function FetchUser() {}

FetchUser.prototype.getUser = async (response, cognitoidentityserviceprovider) => {
  const params = {
    AccessToken: response.AuthenticationResult.AccessToken /* required */,
  };

  const userResponse = await cognitoidentityserviceprovider.getUser(params).promise();
  return userResponse;
};

module.exports = new FetchUser();
