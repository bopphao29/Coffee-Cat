const cartModel = require("../models/cartModel");
const Helper = require("../helper").Helper;
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const UPLOADS_PATH = `http://localhost:${process.env.PORT}/uploads/`;

async function getCartByUser(req, res) {
  const decodedToken = await Helper.getRole(req);
  let userId = "";
  if (decodedToken != null) {
    userId = decodedToken.userId;
  }

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    const cart = await cartModel.getCartByUser(userId);
    if (cart.length == 0) {
      return res.status(404).json({
        error: "cart not found",
      });
    }

    let cartItems = await cartModel.getProductsByCart(cart[0].id);

    cartItems = cartItems.map((product) => {
      product.image = UPLOADS_PATH + product.image;
      return product;
    });
    return res.status(200).json(cartItems);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function addProductToCart(req, res) {
  const decodedToken = await Helper.getRole(req);
  let userId = "";
  if (decodedToken != null) {
    userId = decodedToken.userId;
  }
  if (Helper.checkNullOrEmpty(userId)) {
    return res.status(400).json({
      error: "please log in to add products to your cart",
    });
  }

  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }
  const productId = req.body.productId;

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    const product = await productModel.getDetail(role, productId);

    if (product.length == 0) {
      return res.status(404).json({
        error: "product not found",
      });
    }

    const price = product[0].price;

    const cart = await cartModel.getCartByUser(userId);
    if (cart.length == 0) {
      return res.status(404).json({
        error: "cart not found",
      });
    }
    const cartId = cart[0].id;

    // update cart
    let quantity = parseInt(cart[0].quantity) + 1;
    let total = parseFloat(cart[0].totalAmount) + parseFloat(price);
    await cartModel.updateCart(cartId, quantity, total);

    const cartItems = await cartModel.getProductInCartByProductId(
      cartId,
      productId
    );

    if (cartItems.length == 0) {
      await cartModel.addProductToCart(cartId, productId, price);
    } else if (cartItems.length > 0) {
      quantity = parseInt(cartItems[0].quantity) + 1;
      total = parseFloat(cartItems[0].total) + parseFloat(price);
      await cartModel.updateQuantity(cartId, productId, quantity, total);
    }

    return res.status(200).json({
      message: "add product to cart successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function removeProductFromCart(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }

  const userId = res.locals.userId;
  const productId = req.body.productId;

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    const product = await productModel.getDetail(role, productId);
    if (product.length == 0) {
      return res.status(404).json({
        error: "product not found",
      });
    }
    const price = product[0].price;
    const cart = await cartModel.getCartByUser(userId);
    if (cart.length == 0) {
      return res.status(404).json({
        error: "cart not found",
      });
    }
    const cartId = cart[0].id;
    await cartModel.removeProductFromCart(cartId, productId);

    return res.status(200).json({
      message: "removed product from cart successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

module.exports = {
  getCartByUser,
  addProductToCart,
  removeProductFromCart,
};
