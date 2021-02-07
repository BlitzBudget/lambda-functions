

exports.handler = async (event) => {
  console.log("fetching item for the userId ", event['body-json'].userId);
  let walletData = {};

  await handleFetchWallet(event, walletData);

  return walletData;
};
