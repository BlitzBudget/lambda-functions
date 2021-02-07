
async function handleUpdateItems(event) {
    await updatingItem(event).then(function () {
        console.log("successfully saved the new goals");
    }, function (err) {
        throw new Error("Unable to save the changes to the wallet " + err);
    });
}