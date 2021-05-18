module.exports.createParameter = (randomValue, event) => ({
  TableName: process.env.TABLE_NAME,
  Item: {
    pk: event['body-json'].walletId,
    sk: randomValue,
    goal_type: event['body-json'].goalType,
    final_amount: event['body-json'].targetAmount,
    preferable_target_date: event['body-json'].targetDate,
    actual_target_date: event['body-json'].actualTargetDate,
    monthly_contribution: event['body-json'].monthlyContribution,
    target_id: event['body-json'].targetId,
    target_type: event['body-json'].targetType,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
