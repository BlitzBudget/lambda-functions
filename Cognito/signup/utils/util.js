function Util() {}

const constants = require('../constants/constant');

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj && Object.keys(obj).length !== 0) { return false; }

  // Check if obj is an element
  if (obj instanceof Element) return false;

  return true;
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

function includesStr(arr, val) {
  return isEmpty(arr) ? null : arr.includes(val);
}

const splitElement = (str, splitString) => {
  if (includesStr(str, splitString)) {
    return isEmpty(str) ? str : str.split(splitString);
  }

  return str;
};

function checkIfEmailContainsSpecialCharacters(fullname) {
  // eslint-disable-next-line no-useless-escape
  const possibleSym = /[!#$%&'*+-\/=?^_`{|}~]/;
  const matchFound = fullname.match(possibleSym);
  return { matchFound };
}

// First Letter Upper case
function capitalizeFirstLetter(name) {
  if (isEmpty(name)) {
    return constants.EMPTY;
  }

  return name.length > 1
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : name.charAt(0).toUpperCase();
}

function fetchUsername(name) {
  if (Array.isArray(name)) {
    return capitalizeFirstLetter(name[0]);
  }
  return capitalizeFirstLetter(name);
}

function fetchSurname(name) {
  if (Array.isArray(name)) {
    return capitalizeFirstLetter(name[1]) + capitalizeFirstLetter(name[2]).trim();
  }
  return constants.EMPTY;
}

function filterEmptyElementsFromArray(arr) {
  if (Array.isArray(arr)) {
    return arr.filter((el) => isNotEmpty(el));
  }
  return arr;
}

function fetchNames(fullname, matchFound) {
  const name = filterEmptyElementsFromArray(splitElement(fullname, matchFound));
  const username = fetchUsername(name);
  const surname = fetchSurname(name);
  return { username, surname };
}

function fetchFirstElement(arr) {
  if (Array.isArray(arr)) {
    return isEmpty(arr) ? null : arr[0];
  }
  return arr;
}

// Calculate First Name and Last Name
Util.prototype.fetchFirstAndFamilyName = (email) => {
  const fullname = fetchFirstElement(splitElement(email, '@'));
  const { matchFound } = checkIfEmailContainsSpecialCharacters(fullname);

  return fetchNames(fullname, matchFound);
};

Util.prototype.isEmpty = isEmpty;

// Export object
module.exports = new Util();
