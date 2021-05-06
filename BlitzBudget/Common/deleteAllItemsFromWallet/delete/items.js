module.exports.deleteItems = async (params, documentClient) => {
  const response = await documentClient.batchWrite(params).promise();
  return response;
};
