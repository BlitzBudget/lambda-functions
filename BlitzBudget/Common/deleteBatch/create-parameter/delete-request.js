module.exports.createParameter = (walletId, secondaryKey) => ({
  DeleteRequest: {
    Key: {
      pk: walletId,
      sk: secondaryKey,
    },
  },
});
