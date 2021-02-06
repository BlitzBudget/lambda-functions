/*
 * Populate the date meant for attribute in the transactions
 */
function constructTransactionsWithDateMeantForAndCategory(datesMap, categoryMap, event, requestArr) {
    let recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
    let walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
    let amount = parseInt(event.Records[0].Sns.MessageAttributes.amount.Value);
    let description = event.Records[0].Sns.MessageAttributes.description.Value;
    let category = event.Records[0].Sns.MessageAttributes.category.Value;
    let account = event.Records[0].Sns.MessageAttributes.account.Value;
    let tags = event.Records[0].Sns.MessageAttributes.tags;
    if (isNotEmpty(tags)) {
        tags = JSON.parse(tags.Value);
        console.log("The tags for the transaction is ", tags);
    }
    let dateMeantFor;

    let nextScheduled = event.Records[0].Sns.MessageAttributes["next_scheduled"].Value;
    let nextScheduledDate = new Date(nextScheduled);
    let today = new Date();

    while (nextScheduledDate < today) {
        let sk = "Transaction#" + nextScheduledDate.toISOString();

        let compareString = sk.substring(12, 19);
        if (isNotEmpty(datesMap[compareString])) {
            console.log("The date for the transaction %j ", sk, " is ", datesMap[compareString]);
            dateMeantFor = datesMap[compareString];
        }

        if (isNotEmpty(categoryMap[compareString])) {
            console.log("The category for the transaction %j ", sk, " is ", categoryMap[compareString]);
            category = categoryMap[compareString];
        }

        requestArr.push({
            "PutRequest": {
                "Item": {
                    "pk": walletId,
                    "sk": sk,
                    "recurrence": recurrence,
                    "amount": amount,
                    "description": description,
                    "category": category,
                    "account": account,
                    "tags": tags,
                    "date_meant_for": dateMeantFor,
                    "creation_date": nextScheduledDate.toISOString(),
                    "updated_date": new Date().toISOString()
                }
            }
        });

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
    }
}