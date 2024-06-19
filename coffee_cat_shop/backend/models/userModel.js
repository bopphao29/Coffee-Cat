const Helper = require("../helper").Helper;
const query = require("../sqlPool");

async function createUser(phone, fullname, email, address, password) {
  const sql =
    "INSERT INTO users (phone, fullname, email, address, password) VALUES (?, ?, ?, ?, ?)";
  return query(sql, [phone, fullname, email, address, password]);
}

async function findByPhone(phone) {
  const sql = `
      SELECT u.id AS userId, roleId, role, u.phone, u.fullname, u.email, u.address, u.password, u.status, u.createdAt, u.updatedAt
      FROM users u
      WHERE phone = ? AND u.isDeleted = 0
    `;
  return query(sql, [phone]);
}

async function findByEmail(email) {
  const sql = `
        SELECT * FROM users WHERE email = ? AND isDeleted = 0
    `;
  return query(sql, [email]);
}

async function findById(userId) {
  const sql = "SELECT * FROM users WHERE id = ? AND isDeleted = 0";
  return query(sql, [userId]);
}

async function changePassword(userId, newPashword) {
  const sql = "UPDATE users SET password = ? WHERE id = ?";
  return query(sql, [newPashword, userId]);
}

async function getInfo(userId) {
  const sql =
    "SELECT id, phone, fullname, email, address FROM users WHERE id = ?";
  return query(sql, [userId]);
}

async function updateInfo(userId, newPhone, newFullname, newEmail, newAddress) {
  let sql = "UPDATE users SET isDeleted = 0";
  const params = [];

  if (newPhone) {
    sql += " , phone = ?";
    params.push(newPhone);
  }
  if (newFullname) {
    sql += " , fullname = ?";
    params.push(newFullname);
  }
  if (newEmail) {
    sql += " , email = ?";
    params.push(newEmail);
  }
  if (newAddress) {
    sql += " , address = ?";
    params.push(newAddress);
  }

  sql += " WHERE id = ?";
  params.push(userId);

  return query(sql, params);
}

async function getTotal(phone, fullname, address, status, roleId) {
  let sql = `
        SELECT COUNT(*) AS total FROM users u LEFT JOIN roles r ON u.roleId = r.id WHERE u.isDeleted = 0
    `;
  const params = [];

  if (phone) {
    sql += " AND u.phone LIKE ?";
    params.push(`%${phone}%`);
  }
  if (fullname) {
    sql += " AND u.fullname LIKE ?";
    params.push(`%${fullname}%`);
  }
  if (address) {
    sql += " AND u.address LIKE ?";
    params.push(`%${address}%`);
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND u.status = ?";
    params.push(status);
  }
  if (roleId) {
    sql += " AND u.roleId = ?";
    params.push(roleId);
  }
  return query(sql, params);
}

async function getList(
  phone,
  fullname,
  address,
  status,
  roleId,
  pageIndex,
  pageSize
) {
  let sql = `
        SELECT u.id, roleId, r.name AS role, u.phone, u.fullname, u.email, u.address, u.status, u.createdAt, u.updatedAt
        FROM users u LEFT JOIN roles r ON u.roleId = r.id
        WHERE u.isDeleted = 0 AND roleId = 2
    `;
  const params = [];

  if (phone) {
    sql += " AND u.phone LIKE ?";
    params.push(`%${phone}%`);
  }
  if (fullname) {
    sql += " AND u.fullname LIKE ?";
    params.push(`%${fullname}%`);
  }
  if (address) {
    sql += " AND u.address LIKE ?";
    params.push(`%${address}%`);
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND u.status = ?";
    params.push(status);
  }
  if (roleId) {
    sql += " AND u.roleId = ?";
    params.push(roleId);
  }
  sql += " ORDER BY u.id DESC";
  if (pageIndex && pageSize) {
    sql += " LIMIT ?, ?";
    params.push((pageIndex - 1) * pageSize);
    params.push(pageSize);
  }

  return query(sql, params);
}

async function getDetail(userId) {
  const sql = `
        SELECT u.id, roleId, r.name AS role, u.phone, u.fullname, u.email, u.address, u.status, u.createdAt, u.updatedAt
        FROM users u LEFT JOIN roles r ON u.roleId = r.id
        WHERE u.isDeleted = 0 AND u.id = ?
    `;

  return query(sql, [userId]);
}

async function deleteUser(userId) {
  const sql = "UPDATE users SET isDeleted = 1, status = 0 WHERE id = ?";
  return query(sql, [userId]);
}

async function updateStatus(userId, newStatus) {
  let sql = "UPDATE users SET isDeleted = 0";
  if (!Helper.checkNullOrEmpty(newStatus)) {
    sql += " , status = ?";
  }
  sql += " WHERE id = ?";
  return query(sql, [newStatus, userId]);
}

async function updateRole(userId, newRole) {
  let sql = "UPDATE users SET isDeleted = 0";
  if (!Helper.checkNullOrEmpty(newRole)) {
    sql += " , roleId = ?";
  }
  sql += " WHERE id = ?";
  return query(sql, [newRole, userId]);
}

module.exports = {
  createUser,
  findByPhone,
  findByEmail,
  findById,
  changePassword,
  getInfo,
  updateInfo,
  getTotal,
  getList,
  getDetail,
  deleteUser,
  updateStatus,
  updateRole,
};
