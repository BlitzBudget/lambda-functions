module.exports.deleteItems = async (params, DB) => {
  const response = await DB.batchWrite(params).promise();
  return response;
};
