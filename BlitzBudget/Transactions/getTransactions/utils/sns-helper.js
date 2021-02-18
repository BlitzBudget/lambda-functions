const SnsHelper = () => {};

const helper = require('./helper');

/*
 * Send to SNS events
 */
async function sendSNSToCreateNewTransactions(snsEvents) {
  if (helper.isNotEmpty(snsEvents)) {
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
