module.exports.createConfirmSignupParameters = (event) => ({
  ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
  ConfirmationCode: event['body-json'].confirmationCode,
  Username: event['body-json'].username,
});
