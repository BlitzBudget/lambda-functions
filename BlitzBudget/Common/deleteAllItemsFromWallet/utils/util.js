// Splits array into chunks
module.exports.chunkArrayInGroups = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

module.exports.noItemsPresent = (result) => result.Count === 0;
