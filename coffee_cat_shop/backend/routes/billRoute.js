const express = require("express");
const query = require("../sqlPool.js");
const router = express.Router();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");
let uuid = require("uuid");
let auth = require("../services/authentication.js");
let checkRole = require("../services/checkRole.js");
const Helper = require("../helper.js").Helper;

router.post(
  "/generateReport",
  auth.authenticateToken,
  checkRole.checkRole,
  async (req, res, next) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    let productDetailsReport = JSON.parse(orderDetails.productDetails);

    let sql =
      "INSERT INTO bills(name,uuid,email,contactNumber,paymentMethod,total,productDetails)" +
      " VALUES(?,?,?,?,?,?,?)";
    try {
      const results = await query(sql, [
        orderDetails.name,
        generatedUuid,
        orderDetails.email,
        orderDetails.contactNumber,
        orderDetails.paymentMethod,
        orderDetails.totalAmount,
        orderDetails.productDetails,
        res.locals.email,
      ]);
      ejs.renderFile(
        path.join(__dirname, "", "report.ejs"),
        {
          productDetails: productDetailsReport,
          name: orderDetails.name,
          email: orderDetails.email,
          contactNumber: orderDetails.contactNumber,
          paymentMethod: orderDetails.paymentMethod,
          totalAmount: orderDetails.totalAmount,
        },
        (err, results) => {
          if (err) {
            return Helper.dbErrorReturn(err, res);
          } else {
            pdf
              .create(results)
              .toFile("./bill/" + generatedUuid + ".pdf", function (err, data) {
                if (err) {
                  return Helper.dbErrorReturn(err, res);
                } else {
                  return res.status(200).json({ uuid: generatedUuid });
                }
              });
          }
        }
      );
    } catch (err) {
      return Helper.dbErrorReturn(err, res);
    }
  }
);

router.post(
  "/getPdf",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    const orderDetails = req.body;
    const pdfPath = "./generated_pdf/" + orderDetails.uuid + ".pdf";
    if (fs.existsSync(pdfPath)) {
      res.contentType("application/pdf");
      fs.createReadStream(pdfPath).pipe(res);
    } else {
      let productDetailsReport = JSON.parse(orderDetails.productDetails);
      ejs.renderFile(
        path.join(__dirname, "", "report.ejs"),
        {
          productDetails: productDetailsReport,
          name: orderDetails.name,
          email: orderDetails.email,
          contactNumber: orderDetails.contactNumber,
          paymentMethod: orderDetails.paymentMethod,
          totalAmount: orderDetails.totalAmount,
        },
        (err, results) => {
          if (err) {
            return Helper.dbErrorReturn(err, res);
          } else {
            pdf
              .create(results)
              .toFile(
                "./generated_pdf/" + "bill-" + orderDetails.uuid + ".pdf",
                function (err, data) {
                  if (err) {
                    return Helper.dbErrorReturn(err, res);
                  } else {
                    res.contentType("application/pdf");
                    fs.createReadStream(pdfPath).pipe(res);
                  }
                }
              );
          }
        }
      );
    }
  }
);

router.get("/getBills", auth.authenticateToken, async (req, res, next) => {
  let sql = "SELECT * FROM bills ORDER BY id DESC";
  try {
    const results = await query(sql);
    return res.status(200).json(results);
  } catch (err) {
    return Helper.dbErrorReturn(err, res);
  }
});

router.delete("/delete/:id", auth.authenticateToken, async (req, res, next) => {
  const id = req.params.id;
  let sql = "DELETE FROM bills WHERE id=?";
  try {
    const results = await query(sql, [id]);
    if (results.affectedRows == 0) {
      return res.status(404).json({ error: "Bill ID is not exists" });
    }
    return res.status(200).json({ message: "Delete bill successfully" });
  } catch (err) {
    return Helper.dbErrorReturn(err, res);
  }
});

module.exports = router;
