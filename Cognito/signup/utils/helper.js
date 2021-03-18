function Helper() {}

const { isEmpty } = require('./util');
const util = require('./util');

Helper.prototype.extractFirstAndLastName = (firstname, lastName, email) => {
  let username = firstname;
  let surname = lastName;

  if (util.isEmpty(firstname) || util.isEmpty(lastName)) {
    ({ username, surname } = util.fetchFirstAndFamilyName(email));
  }
  return { username, surname };
};

Helper.prototype.emailToLowerCase = (email) => {
  if (isEmpty(email)) {
    return email;
  }
  return email.toLowerCase().trim();
};

// Export object
module.exports = new Helper();
