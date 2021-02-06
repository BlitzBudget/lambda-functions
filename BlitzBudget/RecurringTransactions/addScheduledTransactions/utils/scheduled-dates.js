
/*
 * Build params for put items (transactions)
 */
function calculateNextScheduledDates(event) {

    if (isEmpty(event.Records[0])) {
        return;
    }

    let nextScheduled = event.Records[0].Sns.MessageAttributes["next_scheduled"].Value;
    let recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
    let nextScheduledDate = new Date(nextScheduled);
    let today = new Date();
    let i = 0;

    while (nextScheduledDate < today) {
        console.log("The scheduled date is %j", nextScheduledDate);

        /*
         * Scheduled Transactions
         */
        let nextScheduledDateAsString = nextScheduledDate.getFullYear() + '-' + ('0' + (nextScheduledDate.getMonth() + 1)).slice(-2);
        if (notIncludesStr(nextSchArray, nextScheduledDateAsString)) {
            nextSchArray.push(nextScheduledDateAsString);
        }


        // Update recurrence
        switch (recurrence) {
            case 'MONTHLY':
                nextScheduledDate.setMonth(nextScheduledDate.getMonth() + 1);
                break;
            case 'WEEKLY':
                nextScheduledDate.setDate(nextScheduledDate.getDate() + 7);
                break;
            case 'BI-MONTHLY':
                nextScheduledDate.setDate(nextScheduledDate.getDate() + 15);
                break;
            default:
                nextScheduledDate = new Date();
                break;
        }
        // Update counter
        i++;
    }

    /*
     * Set the next date field for recurring transaction
     */
    recurringTransactionsNextSch = nextScheduledDate.toISOString();
}
