require("dotenv").config();
const express = require("express");
const router = express.Router();
let auth = require("../services/authentication.js");
let checkRole = require("../services/checkRole.js");
const orderController = require("../controllers/orderController.js");
const moment = require("moment-timezone");
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");
const Helper = require("../helper.js").Helper;

router.post("/", auth.authenticateToken, orderController.getList);
router.post(
  "/placeAnOrder",
  auth.authenticateToken,
  orderController.placeAnOrder
);
router.post(
  "/updateStatus",
  auth.authenticateToken,
  // checkRole.checkRole,
  orderController.updateStatus
);
router.post(
  "/exportPDF",
  auth.authenticateToken,
  // checkRole.checkRole,
  (req, res, next) => {
    const orderDetails = req.body;
    moment.tz.setDefault("Asia/Ho_Chi_Minh");
    const currentDate = moment().format("YYYYMMDDHHmmss");
    const orderCode = "ORDER" + currentDate;
    const pdfPath = "./order/" + orderCode + ".pdf";
    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      fs.createReadStream(pdfPath).pipe(res);
    } else {
      // let productDetailsReport = JSON.parse(orderDetails.productDetails);
      ejs.renderFile(
        path.join(__dirname, "", "report.ejs"),
        {
          productDetails: orderDetails.productDetails,
          fullname: orderDetails.fullname,
          phone: orderDetails.phone,
          address: orderDetails.address,
          paymentMethod: orderDetails.paymentMethod,
          totalAmount: orderDetails.totalAmount,
        },
        (err, results) => {
          if (err) {
            return Helper.dbErrorReturn(err, res);
          } else {
            pdf
              .create(results)
              .toFile("./order/" + orderCode + ".pdf", function (err, data) {
                if (err) {
                  return Helper.dbErrorReturn(err, res);
                } else {
                  res.contentType("application/pdf");
                  fs.createReadStream(pdfPath).pipe(res);
                }
              });
          }
        }
      );
    }
  }
);

module.exports = router;
