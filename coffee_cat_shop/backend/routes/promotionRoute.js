require("dotenv").config();
const express = require("express");
const router = express.Router();
let auth = require("../services/authentication.js");
let checkRole = require("../services/checkRole.js");
let promotionController = require("../controllers/promotionController.js");

router.post(
  "/",
  auth.authenticateToken,
  checkRole.checkRole,
  promotionController.getList
);
router.post(
  "/create",
  auth.authenticateToken,
  checkRole.checkRole,
  promotionController.addNewPromotion
);
router.get(
  "/detail/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  promotionController.getDetail
);
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  promotionController.updatePromotion
);
router.post(
  "/delete/:id",
  auth.authenticateToken,
  checkRole.checkRole,
  promotionController.deletePromotion
);
router.patch(
  "/apply",
  auth.authenticateToken,
  checkRole.checkRole,
  promotionController.apply
);

module.exports = router;
