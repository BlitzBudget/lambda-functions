function Helper() {}

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { walletId } = event['body-json'];
  const curentPeriod = event['body-json'].category.substring(9, 16);
  return { walletId, curentPeriod };
};

// Export object
module.exports = new Helper();
