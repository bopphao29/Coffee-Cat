const Helper = require("../helper").Helper;
const query = require("../sqlPool");

async function getTotal(roleId, name, status) {
  const params = [];

  let sql = "SELECT COUNT(*) AS total FROM products WHERE isDeleted = 0";

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

  let sql =
    "SELECT p.id, p.name, i.image,";
  if (role != "admin") {
    sql += `
      CASE 
        WHEN p.salePrice = 0 THEN p.price 
        ELSE p.salePrice 
      END AS price,
    `;
  } else {
    sql += " p.price, p.salePrice,";
  }
  sql += `
        p.salePrice, p.stockQuantity, p.description, p.categoryId, c.name AS categoryName, p.createdAt, p.updatedAt
      FROM products p LEFT JOIN categories c ON p.categoryId = c.id
          LEFT JOIN images i ON p.id = i.productId
      WHERE p.isDeleted = 0
    `;

  if (role !== "admin") {
    sql += " AND p.status = 1 AND p.stockQuantity > 0";
  }
  if (name) {
    sql += " AND p.name LIKE ?";
    params.push(`%${name}%`);
  }
  if (!Helper.checkNullOrEmpty(status)) {
    sql += " AND p.status = ?";
    params.push(status);
  }
  sql += " ORDER BY id DESC";

  return query(sql, params);
}

async function findByName(name) {
  const sql = "SELECT * FROM products WHERE name LIKE ? AND isDeleted=0";
  return query(sql, [name]);
}

async function  addNewProduct(
  name,
  price,
  importQuantity,
  categoryId,
  description
) {
  const sql = `
    INSERT INTO products (name, price, stockQuantity, categoryId, description)
    VALUES (?, ?, ?, ?,?)
  `;
  return query(sql, [
    name,
    price,
    importQuantity,
    categoryId,
    description,
  ]);
}

async function addImage(productId, image) {
  const sql = "INSERT INTO images (productId, image) VALUES (?, ?)";
  return query(sql, [productId, image]);
}

async function findById(productId) {
  const sql = "SELECT * FROM products WHERE id = ? AND isDeleted = 0";
  return query(sql, [productId]);
}

async function getDetail(role, productId) {
  let sql =
    "SELECT p.id, p.name, i.image,";
  if (role == "user") {
    sql += `
      CASE 
        WHEN p.salePrice = 0 THEN p.price 
        ELSE p.salePrice 
      END AS price,
    `;
  } else {
    sql += " p.price, p.salePrice,";
  }
  sql += `
          p.stockQuantity, p.description, p.categoryId, c.name AS categoryName, p.createdAt, p.updatedAt
      FROM products p LEFT JOIN categories c ON p.categoryId = c.id
          LEFT JOIN images i ON p.id = i.productId
      WHERE p.isDeleted = 0 AND p.id = ?
    `;

  return query(sql, [productId]);
}

async function updateProduct(
  productId,
  newName,
  newPrice,
  newImportQuantity,
  newCategoryId,
  newDescription,
  newStatus
) {
  let sql = "UPDATE products SET isDeleted = 0";
  const params = [];

  if (newName) {
    sql += " , name = ?";
    params.push(newName);
  }
  if (newPrice) {
    sql += " , price = ?";
    params.push(newPrice);
  }
  if (newImportQuantity) {
    sql += " , stockQuantity = ?";
    params.push(newImportQuantity);
  }
  if (newCategoryId) {
    sql += " , categoryId = ?";
    params.push(newCategoryId);
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
  params.push(productId);
  return query(sql, params);
}

async function updateImage(image, productId) {
  let sql = "UPDATE images SET isDeleted = 0";
  if (!Helper.checkNullOrEmpty(image)) {
    sql += " image = ?";
  }
  sql += " WHERE productId = ?";
  return query(sql, [image, productId]);
}

async function deleteProduct(productId) {
  const sql = "UPDATE products SET isDeleted = 1, status = 0 WHERE id = ?";
  return query(sql, [productId]);
}

async function getByCategory(categoryId) {
  const sql = `
      SELECT p.id, p.name, i.image, p.initialPrice, p.price, p.importQuantity, p.stockQuantity, p.categoryId, c.name AS categoryName, p.createdAt
      FROM products p LEFT JOIN categories c ON p.categoryId = c.id
          LEFT JOIN images i ON p.id = i.productId
      WHERE p.isDeleted = 0 AND categoryId = ?
    `;

  return query(sql, [categoryId]);
}

async function updateStockQuantity(productId, quantity) {
  const sql = "UPDATE products SET stockQuantity = ? WHERE id = ?";
  return query(sql, [quantity, productId]);
}

async function applyPromotion(percent) {
  const sql =
    "UPDATE products SET salePrice = price - (price * ? / 100) WHERE isDeleted = 0 AND status = 1";
  return query(sql, [percent]);
}

async function unApplyPromotion() {
  const sql =
    "UPDATE products SET salePrice = 0 WHERE isDeleted = 0 AND status = 1";
  return query(sql);
}

module.exports = {
  getTotal,
  getList,
  findByName,
  addNewProduct,
  getDetail,
  updateProduct,
  deleteProduct,
  addImage,
  updateImage,
  getByCategory,
  updateStockQuantity,
  applyPromotion,
  unApplyPromotion,
};
