console.log('Loading function');

exports.handler = async (event) => {

    updateRelevantItems(event);

    return `Successfully processed ${event.Records.length} records.`;
};