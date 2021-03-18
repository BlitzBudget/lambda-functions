const fetchHelper = require('./utils/fetch-helper');

exports.handler = async (event) => {
  const response = await fetchHelper.fetchUser(event);
  return response;
};
