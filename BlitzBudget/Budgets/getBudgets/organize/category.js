module.exports.organize = (data) => {
  console.log('data retrieved - Category %j', data.Count);
  if (data.Items) {
    data.Items.forEach((categoryObj) => {
      const category = categoryObj;
      category.categoryId = categoryObj.sk;
      category.walletId = categoryObj.pk;
      delete category.sk;
      delete category.pk;
    });
  }
};
