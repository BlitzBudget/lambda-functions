const Login = () => {};

Login.prototype.initiateAuth = (params, cisp) => new Promise((resolve, reject) => {
  cisp.initiateAuth(params, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
      reject(err);
    } else {
      console.log(data); // successful response
      resolve(data);
    }
  });
});

// Export object
module.exports = new Login();
