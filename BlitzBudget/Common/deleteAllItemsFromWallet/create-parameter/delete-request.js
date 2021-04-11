module.exports.createParameter = (walletId, seondaryKey) => ({
  DeleteRequest: {
    Key: {
      pk: walletId,
      sk: seondaryKey,
    },
  },
});
