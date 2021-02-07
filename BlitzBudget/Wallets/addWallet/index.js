const helper = require('utils/helper');
const addHelper = require('utils/add-helper');

exports.handler = async (event) => {
    let { userId, currency, walletName } = helper.extractVariablesFromRequest(event);
    console.log("events ", JSON.stringify(event));
    await addHelper.handleAddNewWallet(event, userId, currency, walletName);

    return event;
};

