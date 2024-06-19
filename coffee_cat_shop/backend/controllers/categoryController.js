const categoryModel = require("../models/categoryModel");
const Helper = require("../helper").Helper;

async function getList(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }

  const { name, status } = req.body;

  try {
    const categories = await categoryModel.getList(role, name, status);

    return res.status(200).json(categories);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function addNewCategory(req, res) {
  let name = req.body.name;
  let description = req.body.description;

  if (Helper.checkNullOrEmpty(name)) {
    return res.status(400).json({
      error: "name is required",
    });
  } else {
    name = name.toUpperCase();
  }

  if (!Helper.checkNullOrEmpty(description)) {
    description = description.toUpperCase();
  }

  try {
    const checkName = await categoryModel.findByName(name);
    if (checkName.length > 0) {
      return res.status(400).json({
        message: "name already exists",
      });
    }

    await categoryModel.addNewCategory(name, description);

    return res.status(200).json({
      message: "add new category successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function getDetail(req, res) {
  const categoryId = req.body.id;

  if (Helper.checkNullOrEmpty(categoryId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const category = await categoryModel.getDetail(categoryId);
    if (category.length == 0) {
      return res.status(404).json({
        error: "category not found",
      });
    }

    return res.status(200).json({
      data: category[0],
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updateCategory(req, res) {
  const categoryId = req.body.id;
  let newName = req.body.name;
  let newDescription = req.body.description;
  const newStatus = req.body.status;

  if (Helper.checkNullOrEmpty(categoryId)) {
    return res.status(400).json({ error: "id is required" });
  }

  if (!Helper.checkNullOrEmpty(newName)) {
    newName = newName.toUpperCase();
  }

  if (!Helper.checkNullOrEmpty(newDescription)) {
    newDescription = newDescription.toUpperCase();
  }

  try {
    newName = newName.toUpperCase();
    newDescription = newDescription.toUpperCase();
    const category = await categoryModel.getDetail(categoryId);
    if (category.length == 0) {
      return res.status(404).json({
        error: "category not found",
      });
    }

    if (category[0].name !== newName) {
      const checkName = await categoryModel.findByName(newName);
      if (checkName.length > 0) {
        return res.status(400).json({
          message: "name already exists",
        });
      }
    }

    await categoryModel.updateCategory(
      categoryId,
      newName,
      newDescription,
      newStatus
    );

    return res.status(200).json({
      message: "category updated successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function deleteCategory(req, res) {
  const categoryId = req.params.id;

  if (Helper.checkNullOrEmpty(categoryId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const category = await categoryModel.getDetail(categoryId);
    if (category.length == 0) {
      return res.status(404).json({
        error: "category not found",
      });
    }

    await categoryModel.deleteCategory(categoryId);

    return res.status(200).json({
      message: "category deleted successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

module.exports = {
  getList,
  addNewCategory,
  getDetail,
  updateCategory,
  deleteCategory,
};
