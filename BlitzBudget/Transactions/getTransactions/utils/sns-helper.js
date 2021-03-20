const SnsHelper = () => {};

const util = require('./util');

/*
 * Send to SNS events
 */
async function sendSNSToCreateNewTransactions(snsEvents) {
  if (util.isNotEmpty(snsEvents)) {
    await Promise.all(snsEvents).then(
      () => {
        console.log(
          'Successfully sent the pending recurring transactions for creation',
        );
      },
      (err) => {
        throw new Error(
          `Unable to send the pending recurring transactions for creation${err}`,
        );
      },
    );
  }
}

SnsHelper.prototype.sendSNSToCreateNewTransactions = sendSNSToCreateNewTransactions;
// Export object
module.exports = new SnsHelper();
