const util = require('../utils/util');

module.exports.organize = (responseData) => {
  const categories = {};

  if (util.isEmpty(responseData.Transaction)) {
    return categories;
  }

  responseData.Transaction.forEach((transObj) => {
    const transaction = transObj;
    if (util.isEmpty(categories[transObj.category])) {
      categories[transObj.category] = transObj.amount;
    } else {
      categories[transObj.category] += transObj.amount;
    }
    transaction.transactionId = transObj.sk;
    transaction.walletId = transObj.pk;
    delete transaction.sk;
    delete transaction.pk;
  });

  return categories;
};
