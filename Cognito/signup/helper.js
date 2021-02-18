const Helper = () => {};

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj
&& Object.keys(obj).length !== 0) { return false; }

  // Check if obj is an element
  if (obj instanceof Element) return false;

  return true;
}

function includesStr(arr, val) {
  return isEmpty(arr) ? null : arr.includes(val);
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

const splitElement = (str, splitString) => {
  if (includesStr(str, splitString)) {
    return isEmpty(str) ? str : str.split(splitString);
  }

  return str;
};

// Calculate First Name and Last Name
const fetchFirstAndFamilyName = (fullName) => {
  // eslint-disable-next-line no-useless-escape
  const possibleSym = /[!#$%&'*+-\/=?^_`{|}~]/;
  const name = {};
  const matchFound = fullName.match(possibleSym);

  if (isNotEmpty(matchFound)) {
    const nameArr = splitElement(fullName, matchFound);
    let firstName = nameArr[0];
    let familyName = nameArr[1];

    // If First Name is empty then assign family name to first name
    if (isEmpty(firstName)) {
      firstName = familyName;
      familyName = nameArr.length > 2 ? nameArr[2] : ' ';
    }

    // First Letter Upper case
    firstName = firstName.length > 1
      ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
      : firstName.charAt(0).toUpperCase();
    familyName = ' ';

    if (isEmpty(familyName)) {
      familyName = familyName.length > 1
        ? familyName.charAt(0).toUpperCase() + familyName.slice(1)
        : familyName.charAt(0).toUpperCase();
    }

    name.firstName = firstName;
    name.familyName = familyName;
  } else {
    // First Letter Upper case
    let firstName = '';

    if (isNotEmpty(fullName)) {
      firstName = fullName.length > 1
        ? fullName.charAt(0).toUpperCase() + fullName.slice(1)
        : fullName.charAt(0).toUpperCase();
    }

    name.firstName = firstName;
    name.familyName = ' ';
  }

  /*
   * Family name
   */
  if (isEmpty(name.familyName)) {
    name.familyName = ' ';
  }

  return name;
};

function fetchFirstElement(arr) {
  if (Array.isArray(arr)) {
    return isEmpty(arr) ? null : arr[0];
  }
  return arr;
}

Helper.prototype.buildParamForSignup = (
  password,
  email,
  firstName,
  lastName,
  accepLan,
) => ({
  ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
  /* required */
  Password: password,
  /* required */
  Username: email,
  /* required */
  UserAttributes: [
    {
      Name: 'email',
      /* required */
      Value: email,
    },
    {
      Name: 'name',
      /* required */
      Value: firstName,
    },
    {
      Name: 'family_name',
      /* required */
      Value: lastName,
    },
    {
      Name: 'locale',
      /* required */
      Value:
          accepLan.length <= 4
            ? accepLan.substring(1, 3)
            : accepLan.substring(1, 6) /* take en or en-US if available */,
    },
    {
      Name: 'custom:financialPortfolioId',
      /* required */
      Value: `User#${new Date().toISOString()}`,
    },
    {
      Name: 'custom:exportFileFormat',
      /* required */
      Value: 'XLS',
    },
  ],
});

Helper.prototype.extractFirstAndLastName = (firstName, lastName, email) => {
  let username = firstName;
  let surname = lastName;
  if (isEmpty(firstName) || isEmpty(lastName)) {
    // Set Name
    const fullName = fetchFirstElement(splitElement(email, '@'));
    const name = fetchFirstAndFamilyName(fullName);
    username = name.firstName;
    surname = name.familyName;
  }
  return { username, surname };
};

Helper.prototype.emailToLowerCase = (email) => email.toLowerCase().trim();

Helper.prototype.isEmpty = isEmpty;

Helper.prototype.isNotEmpty = isNotEmpty;

Helper.prototype.splitElement = splitElement;

Helper.prototype.fetchFirstAndFamilyName = fetchFirstAndFamilyName;

// Export object
module.exports = new Helper();
