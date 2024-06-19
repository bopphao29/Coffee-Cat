const express = require("express");
const query = require("../sqlPool.js");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.js");
let auth = require("../services/authentication.js");
let checkRole = require("../services/checkRole.js");

router.get(
  "/details",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res, next) => {
    try {
      let sql =
        "SELECT COUNT(id) AS categoryCount FROM categories WHERE isDeleted=0";
      const categoryResults = await query(sql);
      const categoryCount = categoryResults[0].categoryCount;

      sql = "SELECT COUNT(id) AS productCount FROM products WHERE isDeleted=0";
      const productResults = await query(sql);
      const productCount = productResults[0].productCount;

      sql = "SELECT COUNT(id) AS billCount FROM bills";
      const billResults = await query(sql);
      const billCount = billResults[0].billCount;

      sql =
        "SELECT COUNT(id) AS userCount FROM users WHERE isDeleted=0 AND roleId = 2";
      const userCounts = await query(sql);
      const userCount = userCounts[0].userCount;

      const data = {
        categories: categoryCount,
        products: productCount,
        bills: billCount,
        users: userCount,
      };

      return res.status(200).json(data);
    } catch (err) {
      return Helper.dbErrorReturn(err, res);
    }
  }
);

router.get(
  "/",
  auth.authenticateToken,
  checkRole.checkRole,
  dashboardController.summaryDashboard
);

router.get(
  "/top5Bill",
  auth.authenticateToken,
  checkRole.checkRole,
  dashboardController.getTop5Bill
);

module.exports = router;
