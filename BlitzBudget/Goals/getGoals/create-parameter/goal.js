const constants = require('../constants/constant');

module.exports.createParameter = (walletId) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :walletId and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':walletId': walletId,
    ':items': 'Goal#',
  },
  ProjectionExpression:
        'preferable_target_date, target_id, target_type, goal_type, monthly_contribution, sk, pk, final_amount',
});
