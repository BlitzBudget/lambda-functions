module.exports.createParameter = (primaryKey, secondaryKey) => ({
  DeleteRequest: {
    Key: {
      pk: primaryKey,
      sk: secondaryKey,
    },
  },
});
