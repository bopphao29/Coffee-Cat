const Helper = require("../helper").Helper;
const dashboardModel = require("../models/dashboardModel");

async function summaryDashboard(req, res) {
  try {
    const categoryResults = await dashboardModel.getTotalCategory();
    const categoryCount = categoryResults[0].categoryCount;

    const productResults = await dashboardModel.getTotalProduct();
    const productCount = productResults[0].productCount;

    const orderResults = await dashboardModel.getTotalOrder();
    const orderCount = orderResults[0].orderCount;

    const userCounts = await dashboardModel.getTotalUser();
    const userCount = userCounts[0].userCount;

    const promotionResults = await dashboardModel.getTotalPromotion();
    const promotionCount = promotionResults[0].promotionCount;

    const data = {
      categories: categoryCount,
      products: productCount,
      orders: orderCount,
      users: userCount,
      promotions: promotionCount,
    };

    return res.status(200).json(data);
  } catch (err) {
    return Helper.dbErrorReturn(err, res);
  }
}

async function getTop5Bill(req, res) {
  try {
    const results = await dashboardModel.getTop5Bill();
    return res.status(200).json(results);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

module.exports = {
  summaryDashboard,
  getTop5Bill,
};
