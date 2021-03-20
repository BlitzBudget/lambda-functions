const Helper = () => {};

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { userId } = event['body-json'];
  // Twelve months ago
  const today = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  twelveMonthsAgo.setDate(1);
  const oneYearAgo = twelveMonthsAgo.toISOString();
  return {
    userId, oneYearAgo, today,
  };
};

// Export object
module.exports = new Helper();
