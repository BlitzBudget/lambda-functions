// Splits array into chunks
const chunkArrayInGroups = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

const isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

module.exports.isEqual = isEqual;
module.exports.chunkArrayInGroups = chunkArrayInGroups;
