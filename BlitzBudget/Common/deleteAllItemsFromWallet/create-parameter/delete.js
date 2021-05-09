module.exports.createParameter = (deleteRequest) => {
  const params = {};
  params.RequestItems = {};
  params.RequestItems.blitzbudget = deleteRequest;
  return params;
};
