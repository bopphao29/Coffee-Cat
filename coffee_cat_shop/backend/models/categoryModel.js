const Helper = require("../helper").Helper;
const query = require("../sqlPool");

async function getTotal(roleId, name, status) {
  const params = [];

  let sql = "SELECT COUNT(*) AS total FROM categories WHERE isDeleted = 0";

  if (roleId == 2) {
    sql += " AND status = 1";
  }
  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND status = ?";
    params.push(status);
  }

  return query(sql, params);
}

async function getList(role, name, status) {
  const params = [];
  let sql = `
      SELECT id, name, description, status, createdAt, updatedAt 
      FROM categories WHERE isDeleted = 0 
    `;

  if (role !== "admin") {
    sql += " AND status = 1";
  }
  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND status = ?";
    params.push(status);
  }
  sql += " ORDER BY updatedAt DESC";

  return query(sql, params);
}

async function findByName(name) {
  const sql = "SELECT * FROM categories WHERE name LIKE ? AND isDeleted=0";
  return query(sql, [name]);
}

async function addNewCategory(name, description) {
  const sql = "INSERT INTO categories (name, description) VALUES (?, ?)";
  return query(sql, [name, description]);
}

async function getDetail(categoryId) {
  const sql = `
        SELECT id, name, description, status, createdAt, updatedAt 
        FROM categories WHERE id = ? AND isDeleted = 0
    `;

  return query(sql, [categoryId]);
}

async function updateCategory(categoryId, newName, newDescription, newStatus) {
  let sql = "UPDATE categories SET isDeleted = 0";
  const params = [];

  if (newName) {
    sql += " , name = ?";
    params.push(newName);
  }
  if (newDescription) {
    sql += " , description = ?";
    params.push(newDescription);
  }
  if (!Helper.checkNullOrEmpty(newStatus)) {
    sql += " , status = ?";
    params.push(newStatus);
  }
  sql += " WHERE id = ?";
  params.push(categoryId);

  return query(sql, params);
}

async function deleteCategory(categoryId) {
  const sql = "UPDATE categories SET isDeleted = 1, status = 0 WHERE id = ?";
  return query(sql, [categoryId]);
}

module.exports = {
  getTotal,
  getList,
  findByName,
  addNewCategory,
  getDetail,
  updateCategory,
  deleteCategory,
};
