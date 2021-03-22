function Login() {}

Login.prototype.initiateAuth = async (params, cisp) => {
  const response = cisp.initiateAuth(params).promise();
  return response;
};

module.exports = new Login();
