const Helper = () => {};

// Splits array into chunks
Helper.prototype.chunkArrayInGroups = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

Helper.prototype.noItemsPresent = (result) => result.Count === 0;

// Export object
module.exports = new Helper();
