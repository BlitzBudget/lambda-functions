const Helper = () => {};

// Splits array into chunks
Helper.prototype.chunkArrayInGroups = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

Helper.prototype.isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { walletId } = event['body-json'];
  const curentPeriod = event['body-json'].category.substring(9, 16);
  return { walletId, curentPeriod };
};

// Export object
module.exports = new Helper();
