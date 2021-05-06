module.exports.createParameter = (walletId, sk) => {
  console.log(' Creating the date wrapper for %j', sk);
  return {
    PutRequest: {
      Item: {
        pk: walletId,
        sk,
        income_total: 0,
        expense_total: 0,
        balance: 0,
        creation_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
    },
  };
};
