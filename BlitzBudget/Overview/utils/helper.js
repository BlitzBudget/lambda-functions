const Helper = () => {};

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { userId } = event['body-json'];
  console.log('fetching item for the walletId %j', event['body-json'].walletId);
  console.log('fetching item with the userId %j', event['body-json'].userId);

  /*
   * Get all dates from one year ago
   */
  const endsWithDate = new Date(event['body-json'].endsWithDate).toISOString();
  const startsWithDate = new Date(
    event['body-json'].startsWithDate,
  ).toISOString();
  const twelveMonthsAgo = new Date(event['body-json'].endsWithDate);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  twelveMonthsAgo.setDate(1);
  const oneYearAgo = twelveMonthsAgo.toISOString();

  console.log('dateMeantFor %j', oneYearAgo);

  return {
    oneYearAgo, userId, startsWithDate, endsWithDate,
  };
};

// Export object
module.exports = new Helper();
