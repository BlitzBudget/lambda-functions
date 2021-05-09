// Splits array into chunks
module.exports.chunkArrayInGroups = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

module.exports.isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};
