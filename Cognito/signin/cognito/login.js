function Login() {}

async function initiateAuth(params, cognitoidentityserviceprovider) {
  const response = await cognitoidentityserviceprovider.initiateAuth(params).promise();
  return response;
}

Login.prototype.initiateAuth = initiateAuth;

// Export object
module.exports = new Login();
