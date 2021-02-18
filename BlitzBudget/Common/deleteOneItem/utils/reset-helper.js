const ResetHelper = () => {};

const publish = require('../sns/publish');

const resetAccount = async (fromSns, sk, sns) => {
  if (fromSns) {
    await publish.publishToResetAccountsSNS(sk, sns).then(
      () => {
        console.log('successfully published the message with walletId %j');
      },
      (err) => {
        throw new Error(`Unable to delete the item ${err}`);
      },
    );
  }
};

ResetHelper.prototype.resetAccount = resetAccount;
// Export object
module.exports = new ResetHelper();
