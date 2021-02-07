
exports.handler = async (event) => {
    let { userId, currency, walletName } = extractVariablesFromRequest(event);
    console.log("events ", JSON.stringify(event));
    await handleAddNewWallet(event, userId, currency, walletName);

    return event;
};

