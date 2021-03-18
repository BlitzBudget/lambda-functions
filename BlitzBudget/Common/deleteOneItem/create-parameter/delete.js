const constants = require('../constants/constant');

module.exports.createParameter = (pk, sk) => ({
  TableName: constants.TABLE_NAME,
  Key: {
    pk,
    sk,
  },
});
