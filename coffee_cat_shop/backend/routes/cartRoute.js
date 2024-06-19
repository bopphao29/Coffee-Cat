require("dotenv").config();
const express = require("express");
const router = express.Router();
let auth = require("../services/authentication.js");
let checkRole = require("../services/checkRole.js");
const cartController = require("../controllers/cartController.js");

router.get("/getByUser", auth.authenticateToken, cartController.getCartByUser);
router.post(
  "/addProduct",
  auth.authenticateToken,
  cartController.addProductToCart
);
router.post(
  "/removeProduct",
  auth.authenticateToken,
  cartController.removeProductFromCart
);

module.exports = router;
