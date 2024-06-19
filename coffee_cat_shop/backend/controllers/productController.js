const { query } = require("express");
const productModel = require("../models/productModel");
const Helper = require("../helper").Helper;

const UPLOADS_PATH = `http://localhost:${process.env.PORT}/uploads/`;

async function getList(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }
  const { name, status } = req.body;

  try {
    const products = await productModel.getList(role, name, status);

    const results = products.map((product) => {
      product.image = UPLOADS_PATH + product.image;
      return product;
    });

    return res.status(200).json(results);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function addNewProduct(req, res) {
  const image = req.file ? req.file.filename : null;
  let name = req.body.name;
  const price = req.body.price;
  const stockQuantity = req.body.stockQuantity;
  const categoryId = req.body.categoryId;
  let description = req.body.description;

  let validate = [];
  if (Helper.checkNullOrEmpty(name)) {
    validate.push("name is required");
  } else {
    name = name.toUpperCase();
  }
  if (Helper.checkNullOrEmpty(price)) {
    validate.push("price is required");
  }
  if (Helper.checkNullOrEmpty(stockQuantity)) {
    validate.push("stockQuantity is required");
  }

  if (Object.keys(validate).length > 0) {
    return res.status(400).json({
      error: validate,
    });
  }

  if (!Helper.checkNullOrEmpty(description)) {
    description = description.toUpperCase();
  }

  try {
    const nameResults = await productModel.findByName(name);

    if (nameResults.length > 0) {
      return res.status(400).json({ error: "Product name already exists" });
    }

    const newProduct = await productModel.addNewProduct(
      name,
      price,
      stockQuantity,
      categoryId,
      description
    );

    if (image) {
      await productModel.addImage(newProduct.insertId, image);
    }

    return res.status(200).json({ message: "Product added successfully" });
  } catch (err) {
    return Helper.dbErrorReturn(err, res);
  }
}

async function getDetail(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }
  const productId = req.params.id;

  if (Helper.checkNullOrEmpty(productId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const product = await productModel.getDetail(role, productId);
    if (product.length == 0) {
      return res.status(404).json({
        error: "product not found",
      });
    }

    const result = product.map((product) => {
      product.image = UPLOADS_PATH + product.image;
      return product;
    });

    return res.status(200).json(result[0]);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updateProduct(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }
  const productId = req.body.id;
  const image = req.file ? req.file.filename : null;
  let name = req.body.name;
  const price = req.body.price;
  const importQuantity = req.body.importQuantity;
  const categoryId = req.body.categoryId;
  let description = req.body.description;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  if (!Helper.checkNullOrEmpty(name)) {
    name = name.toUpperCase();
  }
  if (!Helper.checkNullOrEmpty(description)) {
    description = description.toUpperCase();
  }

  try {
    const productResults = await productModel.getDetail(role, productId);

    if (productResults.length > 0) {
      if (name && name !== productResults[0].name) {
        const nameResults = await productModel.findByName(name);
        if (nameResults.length > 0) {
          return res.status(400).json({ error: "Product name already exists" });
        } else {
          await productModel.updateProduct(
            productId,
            name,
            price,
            importQuantity,
            categoryId,
            description,
          )
          await productModel.updateImage(image, productId);
        }
      } else {
        await productModel.updateProduct(
          productId,
          name,
          price,
          importQuantity,
          categoryId,
          description,
        );
        await productModel.updateImage(image, productId);
      }

      return res.status(200).json({ message: "product updated successfully" })
    } else {
      return res.status(404).json({ error: "Product ID does not exist" });
    }
  } catch (err) {
    return Helper.dbErrorReturn(err, res);
  }
}

async function deleteProduct(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }
  const productId = req.params.id;

  if (Helper.checkNullOrEmpty(productId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const product = await productModel.getDetail(role, productId);
    if (product.length == 0) {
      return res.status(404).json({
        error: "product not found",
      });
    }

    await productModel.deleteProduct(productId);

    return res.status(200).json({
      message: "product deleted successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function getByCategory(req, res) {
  const categoryId = req.params.id;

  if (Helper.checkNullOrEmpty(categoryId)) {
    return res.status(400).json({ error: "categoryId is required" });
  }

  try {
    const products = await productModel.getByCategory(categoryId);

    const results = products.map((product) => {
      product.image = UPLOADS_PATH + product.image;
      return product;
    });

    return res.status(200).json(results);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function applyPromotion(salePrice) {
  const sql =
    "UPDATE products SET salePrice = ? WHERE isDeleted = 0 AND status = 1";
  return query(sql, [salePrice]);
}

async function unApplyPromotion() {
  const sql =
    "UPDATE products SET salePrice = ? WHERE isDeleted = 0 AND status = 1";
  return query(sql, [0]);
}

module.exports = {
  getList,
  addNewProduct,
  getDetail,
  updateProduct,
  deleteProduct,
  getByCategory,
  applyPromotion,
  unApplyPromotion,
};
