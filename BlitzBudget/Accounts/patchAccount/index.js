const helper = require('utils/helper');

exports.handler = async (event) => {
    let events = [];
    console.log("updating BankAccounts for ", JSON.stringify(event['body-json']));
    /*
     * Change all the selected account to false
     */
    await helper.unselectSelectedBankAccount(event, events);

    await helper.handleUpdateBankAccounts(events, event);

    return event;
};
