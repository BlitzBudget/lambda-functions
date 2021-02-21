function Helper() {}

const util = require('./util');

Helper.prototype.extractFirstAndLastName = (firstname, lastName, email) => {
  let username = firstname;
  let surname = lastName;

  if (util.isEmpty(firstname) || util.isEmpty(lastName)) {
    ({ username, surname } = util.fetchFirstAndFamilyName(email));
  }
  return { username, surname };
};

Helper.prototype.emailToLowerCase = (email) => email.toLowerCase().trim();

// Export object
module.exports = new Helper();
