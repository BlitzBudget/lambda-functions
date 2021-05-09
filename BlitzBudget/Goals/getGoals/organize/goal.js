module.exports.organize = (data) => {
  console.log('data retrieved - Goal %j', data.Count);
  if (data.Items) {
    data.Items.forEach((goalObj) => {
      const goal = goalObj;
      goal.goalId = goalObj.sk;
      goal.walletId = goalObj.pk;
      delete goal.sk;
      delete goal.pk;
    });
  }
};
