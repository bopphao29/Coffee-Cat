require("dotenv").config();
const express = require("express");
const query = require("../sqlPool.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const auth = require("../services/authentication.js");
const checkRole = require("../services/checkRole.js");
const userController = require("../controllers/userController.js");
const { Helper } = require("../helper.js");

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: true });
});
router.post("/changePassword", userController.changePassword);
router.get(
  "/",
  auth.authenticateToken,
  checkRole.checkRole,
  userController.getList
);
router.patch(
  "/updateInfo",
  auth.authenticateToken,
  checkRole.checkRole,
  userController.updateInfo
);
router.patch(
  "/updateStatus",
  auth.authenticateToken,
  checkRole.checkRole,
  userController.updateStatus
);

module.exports = router;
