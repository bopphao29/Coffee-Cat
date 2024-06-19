const Helper = require("../helper").Helper;
const query = require("../sqlPool");

async function getTotalCategory() {
  const sql =
    "SELECT COUNT(id) AS categoryCount FROM categories WHERE isDeleted=0";
  return query(sql);
}

async function getTotalProduct() {
  const sql =
    "SELECT COUNT(id) AS productCount FROM products WHERE isDeleted=0";
  return query(sql);
}

async function getTotalPromotion() {
  const sql = "SELECT COUNT(id) AS promotionCount FROM promotions";
  return query(sql);
}

async function getTotalOrder() {
  const sql = "SELECT COUNT(id) AS orderCount FROM orders";
  return query(sql);
}

async function getTotalUser() {
  const sql =
    "SELECT COUNT(id) AS userCount FROM users WHERE isDeleted=0 AND roleId = 2";
  return query(sql);
}

async function getTop5Bill() {
  const sql = "SELECT * FROM bills ORDER BY id DESC LIMIT 5";
  return query(sql);
}

module.exports = {
  getTotalCategory,
  getTotalProduct,
  getTotalPromotion,
  getTotalUser,
  getTop5Bill,
  getTotalOrder,
};
