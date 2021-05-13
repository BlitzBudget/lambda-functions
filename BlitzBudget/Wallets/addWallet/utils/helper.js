module.exports.extractVariablesFromRequest = (event) => {
  const { userId } = event['body-json'];
  const { currency } = event['body-json'];
  const { walletName } = event['body-json'];
  return { userId, currency, walletName };
};
