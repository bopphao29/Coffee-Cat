const Helper = require("../helper").Helper;
const query = require("../sqlPool");

async function insertCart(userId) {
  const sql = "INSERT INTO carts (userId) VALUES (?)";
  return query(sql, [userId]);
}

async function getCartByUser(userId) {
  const sql = "SELECT * FROM carts WHERE userId = ?";
  return query(sql, [userId]);
}

async function getProductsByCart(cartId) {
  const sql = `
    SELECT ci.productId, p.name, p.price, i.image, ci.quantity, ci.total
    FROM cart_items ci 
      LEFT JOIN products p ON ci.productId = p.id
      LEFT JOIN images i ON i.productId = p.id  
    WHERE ci.cartId = ? AND ci.isDeleted = 0
    ORDER BY ci.updatedAt DESC
  `;
  return query(sql, [cartId]);
}

async function updateCart(cartId, quantity, totalAmount) {
  const sql = "UPDATE carts SET quantity = ?, totalAmount = ? WHERE id = ?";
  return query(sql, [quantity, totalAmount, cartId]);
}

async function addProductToCart(cartId, productId, price) {
  const sql =
    "INSERT INTO cart_items (cartId, productId, total) VALUES (?, ?, ?)";
  return query(sql, [cartId, productId, price]);
}

async function updateQuantity(cartId, productId, quantity, price) {
  const sql =
    "UPDATE cart_items SET quantity = ?, total = ? WHERE cartId = ? AND productId = ?";
  return query(sql, [quantity, price, cartId, productId]);
}

async function removeProductFromCart(cartId, productId) {
  let sql =
    "UPDATE cart_items SET isDeleted = 1 WHERE cartId = ? AND productId = ?";
  return query(sql, [cartId, productId]);
}

async function getProductInCartByProductId(cartId, productId) {
  const sql = `
    SELECT * FROM cart_items WHERE cartId = ? AND productId = ? AND isDeleted = 0
  `;
  return query(sql, [cartId, productId]);
}

module.exports = {
  insertCart,
  getCartByUser,
  getProductsByCart,
  addProductToCart,
  updateQuantity,
  removeProductFromCart,
  getProductInCartByProductId,
  updateCart,
};
