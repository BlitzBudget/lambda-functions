const DeleteUser = () => {};

DeleteUser.prototype.handleDeleteUser = (params, cisp) => new Promise((resolve, reject) => {
  cisp.deleteUser(params, (err, data) => {
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
module.exports = new DeleteUser();
