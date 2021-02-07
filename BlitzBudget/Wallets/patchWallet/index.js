
exports.handler = async (event) => {
    console.log("updating goals for ", JSON.stringify(event['body-json']));
    await handleUpdateItems(event);

    return event;
};
