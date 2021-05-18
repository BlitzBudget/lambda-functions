module.exports.AWS_LAMBDA_REGION = process.env.AWS_LAMBDA_REGION;
module.exports.TABLE_NAME = process.env.TABLE_NAME;
module.exports.KEY_CONDITION_EXPRESSION = 'pk = :pk and begins_with(sk, :items)';
module.exports.PROJECTION_EXPRESSION = 'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags';
