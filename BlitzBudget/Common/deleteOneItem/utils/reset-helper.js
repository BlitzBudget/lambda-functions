var resetHelper = function () { };

const publish = require('../sns/publish');

let resetAccount = async function(fromSns, sk, sns) {
    if (fromSns) {
        await publish.publishToResetAccountsSNS(sk, sns).then(function () {
            console.log("successfully published the message with walletId %j");
        }, function (err) {
            throw new Error("Unable to delete the item " + err);
        });
    }
}

resetHelper.prototype.resetAccount = resetAccount;
// Export object
module.exports = new resetHelper();