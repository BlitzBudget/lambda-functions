const constants = require('../constants/constant');

module.exports.createParameter = (record, randomValue) => ({
  TableName: constants.TABLE_NAME,
  Item: {
    pk: record.dynamodb.Keys.sk.S,
    sk: randomValue,
    account_type: 'ASSET',
    account_sub_type: 'Cash',
    bank_account_name: 'Cash',
    linked: false,
    account_balance: 0,
    selected_account: true,
    primary_wallet: record.dynamodb.Keys.pk.S,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
