const query = require("../sqlPool");
const Helper = require("../helper").Helper;

async function getList(role, userId, status) {
  let sql = `
      SELECT o.id, o.orderCode, o.orderDate, o.totalAmount, o.status, o.deliveredDate, o.userId, 
          od.fullname, od.phone, od.address, od.paymentMethod, od.note, od.productDetails
      FROM orders o LEFT JOIN users u ON o.userId = u.id
          LEFT JOIN order_details od ON o.orderCode = od.orderCode
      WHERE 1
    `;
  if (role == "user") {
    sql += " AND o.userId = ?";
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND o.status = ?";
  }
  sql += " ORDER BY o.updatedAt DESC";
  return query(sql, [userId, status]);
}

async function insertOrder(orderCode, userId, totalAmount) {
  const sql =
    "INSERT INTO orders (orderCode, userId, totalAmount) VALUES (?, ?, ?)";
  return query(sql, [orderCode, userId, totalAmount]);
}

async function insertOrderDetails(
  orderCode,
  fullname,
  phone,
  address,
  paymentMethod,
  note,
  productDetails
) {
  const sql = `
      INSERT INTO order_details (orderCode, fullname, phone, address, paymentMethod, note, productDetails)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  return query(sql, [
    orderCode,
    fullname,
    phone,
    address,
    paymentMethod,
    note,
    productDetails,
  ]);
}

async function updateStatus(orderCode, status) {
  const sql = "UPDATE orders SET status = ? WHERE orderCode = ?";
  return query(sql, [status, orderCode]);
}

async function updateDeliveryOrder(orderCode, deliveredDate) {
  const sql = "UPDATE orders SET deliveredDate = ? WHERE orderCode = ?";
  return query(sql, [deliveredDate, orderCode]);
}

async function findByOrderCode(orderCode) {
  const sql = "SELECT * FROM orders WHERE orderCode = ?";
  return query(sql, [orderCode]);
}

module.exports = {
  getList,
  insertOrder,
  insertOrderDetails,
  findByOrderCode,
  updateStatus,
  updateDeliveryOrder,
};
