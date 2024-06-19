require("dotenv").config();
const express = require("express");
const router = express.Router();
let auth = require("../services/authentication.js");
let checkRole = require("../services/checkRole.js");
let categoryController = require("../controllers/categoryController.js");

router.post(
  "/add",
  auth.authenticateToken,
  checkRole.checkRole,
  categoryController.addNewCategory
);

router.get("/", categoryController.getList);

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  categoryController.updateCategory
);

router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  categoryController.deleteCategory
);

module.exports = router;
