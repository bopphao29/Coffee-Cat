const Helper = require("../helper").Helper;
const query = require("../sqlPool");

async function getTotal(role, name, percent, fromDate, toDate, status) {
  const params = [];

  let sql = "SELECT COUNT(*) AS total FROM promotions WHERE isDeleted = 0";
  if (role !== "admin") {
    sql += " AND status = 1";
  }
  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (percent) {
    sql += " AND percent = ?";
    params.push(percent);
  }
  if (fromDate) {
    sql += " AND fromDate <= ?";
    params.push(fromDate);
  }
  if (toDate) {
    sql += " AND toDate >= ?";
    params.push(toDate);
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND status = ?";
    params.push(status);
  }

  return query(sql, params);
}

async function getList(role, name, percent, fromDate, toDate, status) {
  const params = [];

  let sql = `
      SELECT id, name, percent, fromDate, toDate, status, createdAt 
      FROM promotions WHERE isDeleted = 0
    `;
  if (role !== "admin") {
    sql += " AND status = 1";
  }
  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (percent) {
    sql += " AND percent = ?";
    params.push(percent);
  }
  if (fromDate) {
    sql += " AND fromDate <= ?";
    params.push(fromDate);
  }
  if (toDate) {
    sql += " AND toDate >= ?";
    params.push(toDate);
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND status = ?";
    params.push(status);
  }
  sql += " ORDER BY updatedAt DESC";

  return query(sql, params);
}

async function findByName(name) {
  const sql = "SELECT * FROM promotions WHERE name LIKE ? AND isDeleted=0";
  return query(sql, [name]);
}

async function addNewPromotion(name, percent, fromDate, toDate, description) {
  const sql =
    "INSERT INTO promotions (name, percent, fromDate, toDate, description) VALUES (?, ?, ?, ?, ?)";
  return query(sql, [name, percent, fromDate, toDate, description]);
}

async function getDetail(promotionId) {
  let sql = `
      SELECT id, name, percent, fromDate, toDate, description, status, createdAt, updatedAt 
      FROM promotions WHERE id = ? AND isDeleted = 0
    `;
  return query(sql, [promotionId]);
}

async function updatePromotion(
  promotionId,
  newName,
  newPercent,
  newFromDate,
  newToDate,
  newDescription
) {
  let sql = "UPDATE promotions SET isDeleted = 0";
  const params = [];

  if (newName) {
    sql += " , name = ?";
    params.push(newName);
  }
  if (newPercent) {
    sql += " , percent = ?";
    params.push(newPercent);
  }
  if (newFromDate) {
    sql += " , fromDate = ?";
    params.push(newFromDate);
  }
  if (newToDate) {
    sql += " , toDate = ?";
    params.push(newToDate);
  }
  if (newDescription) {
    sql += " , description = ?";
    params.push(newDescription);
  }
  sql += " WHERE id = ?";
  params.push(promotionId);

  return query(sql, params);
}

async function apply(promotionId, newStatus) {
  let sql = "UPDATE promotions SET isDeleted = 0";
  if (!Helper.checkNullOrEmpty(newStatus)) {
    sql += " , status = ?";
  }
  sql += " WHERE id = ?";
  return query(sql, [newStatus, promotionId]);
}

async function deletePromotion(promotionId) {
  const sql = "UPDATE promotions SET isDeleted = 1, status = 0 WHERE id = ?";
  return query(sql, [promotionId]);
}

module.exports = {
  getTotal,
  getList,
  findByName,
  addNewPromotion,
  getDetail,
  updatePromotion,
  apply,
  deletePromotion,
};
