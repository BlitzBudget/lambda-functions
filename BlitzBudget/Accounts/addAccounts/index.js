const helper = require('utils/helper');
const addAccount = require('data/add-account');

exports.handler = async (event) => {
    console.log("adding BankAccounts for ", JSON.stringify(event['body-json']));
    let walletId = event['body-json'].primaryWallet;
    let accountType = event['body-json'].accountType;
    let bankAccountName = event['body-json'].bankAccountName;
    let accountBalance = event['body-json'].accountBalance;
    let selectedAccount = event['body-json'].selectedAccount;

    /*
     * If accountType, bankAccountName, accountBalance or selectedAccount is empty
     */
    helper.checkIfRequestEmpty(accountType, bankAccountName, accountBalance, selectedAccount, walletId);

    await addAccount.addNewBankAccounts(event).then(function (result) {
        console.log("successfully saved the new BankAccounts");
    }, function (err) {
        throw new Error("Unable to add the BankAccounts " + err);
    });

    return event;
};
