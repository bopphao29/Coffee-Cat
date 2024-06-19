const Helper = require("../helper").Helper;
const moment = require("moment-timezone");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const UPLOADS_PATH = `http://localhost:${process.env.PORT}/uploads/`;
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");

async function getList(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }

  const userId = res.locals.userId;
  const status = req.body.status;

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    let orders = await orderModel.getList(role, userId, status);

    return res.status(200).json(orders);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function placeAnOrder(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }
  const userId = res.locals.userId;
  let fullname = req.body.fullname;
  const phone = req.body.phone;
  let address = req.body.address;
  let paymentMethod = req.body.paymentMethod;
  let note = req.body.note;
  let totalAmount = req.body.total;
  const productDetails = req.body.productDetails;

  let validate = [];
  if (Helper.checkNullOrEmpty(fullname)) {
    validate.push("fullname is required");
  } else {
    fullname = fullname.toUpperCase();
  }
  if (Helper.checkNullOrEmpty(phone)) {
    validate.push("phone is required");
  }
  if (Helper.checkNullOrEmpty(address)) {
    validate.push("address is required");
  } else {
    address = address.toUpperCase();
  }
  if (Helper.checkNullOrEmpty(paymentMethod)) {
    validate.push("paymentMethod is required");
  } else {
    paymentMethod = paymentMethod.toUpperCase();
  }
  if (Helper.checkNullOrEmpty(productDetails)) {
    validate.push("productDetails is required");
  }

  if (Object.keys(validate).length > 0) {
    return res.status(400).json({
      error: validate,
    });
  }

  if (!Helper.checkNullOrEmpty(note)) {
    note = note.toUpperCase();
  }

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    for (let i = 0; i < productDetails.length; i++) {
      let productId = productDetails[i].productId;
      let quantity = parseInt(productDetails[i].quantity);
      let product = await productModel.getDetail(role, productId);
      if (product.length == 0) {
        continue;
      }
      let stockQuantity = parseInt(product[0].stockQuantity);
      if (quantity > stockQuantity) {
        return res.status(400).json({
          error: "The quantity ordered is greater than the quantity in stock",
          stockQuantity: stockQuantity,
        });
      }
    }

    let orderProductDetails = JSON.stringify(productDetails);
    moment.tz.setDefault("Asia/Ho_Chi_Minh");
    const currentDate = moment().format("YYYYMMDDHHmmss");
    const orderCode = "ORDER" + currentDate;
    totalAmount = parseFloat(totalAmount);
    await orderModel.insertOrder(orderCode, userId, totalAmount);
    await orderModel.insertOrderDetails(
      orderCode,
      fullname,
      phone,
      address,
      paymentMethod,
      note,
      orderProductDetails
    );

    const cart = await cartModel.getCartByUser(userId);
    const cartId = cart[0].id;
    for (let i = 0; i < productDetails.length; i++) {
      let productId = productDetails[i].productId;
      let quantity = parseInt(productDetails[i].quantity);
      let product = await productModel.getDetail(role, productId);
      if (product.length == 0) {
        continue;
      }
      let stockQuantity = parseInt(product[0].stockQuantity);
      console.log('quantity', quantity);
      console.log('stockQuantity', stockQuantity);
      if (quantity <= stockQuantity) {
        quantity = stockQuantity - quantity;
        await productModel.updateStockQuantity(productId, quantity);
        await cartModel.removeProductFromCart(cartId, productId);
      }
    }

    return res.status(200).json({
      message: "order successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updateStatus(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }
  const orderCode = req.body.orderCode;
  const status = req.body.status;

  try {
    if (role !== "admin") {
      return res.status(403).json({
        error: "you are not allowed to update order status",
      });
    }

    const order = await orderModel.findByOrderCode(orderCode);
    if (order.length == 0) {
      return res.status(404).json({
        error: "order not found",
      });
    }

    await orderModel.updateStatus(orderCode, status);

    return res.status(200).json({
      message: "order status updated successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

module.exports = {
  getList,
  placeAnOrder,
  updateStatus,
};
