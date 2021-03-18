const UpdateBudget = () => {};

UpdateBudget.prototype.updatingBudgets = async (params, documentClient) => {
  console.log('Updating an item...');
  const response = await documentClient.update(params).promise();
  return response;
};

// Export object
module.exports = new UpdateBudget();
