const DeleteItems = () => {};

const constants = require('../constants/constant');

DeleteItems.prototype.deleteOneItem = async (pk, sk, DB) => {
  console.log(`user Id selected for deletion is ${pk}`);

  const params = {
    TableName: constants.TABLE_NAME,
    Key: {
      pk,
      sk,
    },
  };

  const response = await DB.delete(params).promise();
  return response;
};

// Export object
module.exports = new DeleteItems();
