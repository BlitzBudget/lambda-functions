module.exports.createParameter = (
  walletId,
  sk,
  recurrence,
  amount,
  description,
  category,
  account,
  tags,
  dateMeantFor,
  futureDatesToCreate,
) => ({
  PutRequest: {
    Item: {
      pk: walletId,
      sk,
      recurrence,
      amount,
      description,
      category,
      account,
      tags,
      date_meant_for: dateMeantFor,
      creation_date: futureDatesToCreate.toISOString(),
      updated_date: new Date().toISOString(),
    },
  },
});
