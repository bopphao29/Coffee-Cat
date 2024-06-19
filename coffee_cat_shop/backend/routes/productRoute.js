const express = require("express");
const query = require("../sqlPool.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../services/authentication.js");
const checkRole = require("../services/checkRole.js");
const productController = require("../controllers/productController.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add",
  auth.authenticateToken,
  checkRole.checkRole,
  upload.single("image"),
  productController.addNewProduct
);

router.post("/", productController.getList);

router.get("/getByCategory/:id", productController.getByCategory);

router.get("/getById/:id", productController.getDetail);

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  upload.single("image"),
  productController.updateProduct
);

router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  productController.deleteProduct
);

module.exports = router;
