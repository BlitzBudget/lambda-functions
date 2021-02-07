var scheduledDate = function () { };

const helper = require('helper');

/*
 * Build params for put items (transactions)
 */
function calculateNextDateToCreates(event, futureTransactionCreationDate, datesToCreateTransactions) {

    if (isEmpty(event.Records[0])) {
        return;
    }

    let nextScheduled = event.Records[0].Sns.MessageAttributes["next_scheduled"].Value;
    let recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
    let nextDateToCreate = new Date(nextScheduled);
    let today = new Date();
    let i = 0;

    calculateDatesToCreate();

    console.log(" The dates to create are %j", datesToCreateTransactions.toString());

    /*
     * Set the next date field for recurring transaction
     */
    futureTransactionCreationDate = nextDateToCreate.toISOString();

    function calculateDatesToCreate() {
        while (nextDateToCreate < today) {
            console.log("The scheduled date is %j", nextDateToCreate);

            /*
             * Scheduled Transactions
             */
            let nextDateToCreateAsString = nextDateToCreate.getFullYear() + '-' + ('0' + (nextDateToCreate.getMonth() + 1)).slice(-2);
            if (helper.notIncludesStr(datesToCreateTransactions, nextDateToCreateAsString)) {
                datesToCreateTransactions.push(nextDateToCreateAsString);
            }

            // Update recurrence
            switch (recurrence) {
                case 'MONTHLY':
                    nextDateToCreate.setMonth(nextDateToCreate.getMonth() + 1);
                    break;
                case 'WEEKLY':
                    nextDateToCreate.setDate(nextDateToCreate.getDate() + 7);
                    break;
                case 'BI-MONTHLY':
                    nextDateToCreate.setDate(nextDateToCreate.getDate() + 15);
                    break;
                default:
                    nextDateToCreate = new Date();
                    break;
            }
            // Update counter
            i++;
        }
    }
}

scheduledDate.prototype.calculateNextDateToCreates = calculateNextDateToCreates;
// Export object
module.exports = new scheduledDate(); 