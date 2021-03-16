const UpdateBudget = () => {};

UpdateBudget.prototype.updatingBudgets = async (params, docClient) => {
  console.log('Updating an item...');
  const response = await docClient.update(params).promise();
  return response;
};

// Export object
module.exports = new UpdateBudget();
