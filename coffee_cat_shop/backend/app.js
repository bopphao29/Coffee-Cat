const config = require("./config");
const express = require("express");
var cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const billRoute = require("./routes/billRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const promotionRoute = require("./routes/promotionRoute");
const app = express();

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use("/uploads", express.static("uploads"));

app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/products", productRoute);
app.use("/bills", billRoute);
app.use("/dashboard", dashboardRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);
app.use("/promotions", promotionRoute);

app.use(express.static("Frontend"));

module.exports = app;
