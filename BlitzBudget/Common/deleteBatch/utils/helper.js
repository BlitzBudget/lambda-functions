function Helper() {}

// Splits array into chunks
Helper.prototype.chunkArrayInGroups = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

Helper.prototype.noItemsInRequest = (result) => result.length === 0;

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { walletId } = event.params.querystring;
  const result = event.params.querystring.itemIdArray;
  return { result, walletId };
};

// Export object
module.exports = new Helper();
