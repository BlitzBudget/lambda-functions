function Login() {}

Login.prototype.initiateAuth = async (params, cisp) => {
  const response = await cisp.initiateAuth(params).promise();
  return response;
};

// Export object
module.exports = new Login();
