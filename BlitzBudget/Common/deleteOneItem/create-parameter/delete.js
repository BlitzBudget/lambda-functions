module.exports.createParameter = (pk, sk) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk,
    sk,
  },
});
