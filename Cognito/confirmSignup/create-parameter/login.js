module.exports.createLoginParameters = (event) => ({
  AuthFlow: 'USER_PASSWORD_AUTH',
  ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
  AuthParameters: {
    USERNAME: event['body-json'].username,
    PASSWORD: event['body-json'].password,
  },
});
