const promotionModel = require("../models/promotionModel");
const Helper = require("../helper").Helper;
const productModel = require("../models/productModel");

async function getList(req, res) {
  const decodedToken = await Helper.getRole(req);
  let role = "";
  if (decodedToken != null) {
    role = decodedToken.role;
  }

  const { name, percent, fromDate, toDate, status } = req.body;

  try {
    const promotions = await promotionModel.getList(
      role,
      name,
      percent,
      fromDate,
      toDate,
      status
    );

    return res.status(200).json(promotions);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function addNewPromotion(req, res) {
  let name = req.body.name;
  const percent = req.body.percent;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  let description = req.body.description;
  let validate = [];
  if (Helper.checkNullOrEmpty(name)) {
    validate.push("name is required");
  } else {
    name = name.toUpperCase();
  }
  if (Helper.checkNullOrEmpty(percent)) {
    validate.push("percent is required");
  }
  if (Helper.checkNullOrEmpty(fromDate)) {
    validate.push("fromDate is required");
  }
  if (Helper.checkNullOrEmpty(toDate)) {
    validate.push("percent is required");
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
    const checkName = await promotionModel.findByName(name);
    if (checkName.length > 0) {
      return res.status(400).json({
        error: "name already exists",
      });
    }

    await promotionModel.addNewPromotion(
      name,
      percent,
      fromDate,
      toDate,
      description
    );

    return res.status(200).json({
      message: "add new promotion successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function getDetail(req, res) {
  const promotionId = req.params.id;

  if (Helper.checkNullOrEmpty(promotionId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const promotion = await promotionModel.getDetail(promotionId);
    if (promotion.length == 0) {
      return res.status(404).json({
        error: "promotion not found",
      });
    }

    return res.status(200).json(promotion[0]);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updatePromotion(req, res) {
  const promotionId = req.body.id;
  let newName = req.body.name;
  const newPercent = req.body.percent;
  const newFromDate = req.body.fromDate;
  const newToDate = req.body.toDate;
  let newDescription = req.body.description;

  if (Helper.checkNullOrEmpty(promotionId)) {
    return res.status(400).json({ error: "id is required" });
  }

  if (!Helper.checkNullOrEmpty(newName)) {
    newName = newName.toUpperCase();
  }

  if (!Helper.checkNullOrEmpty(newDescription)) {
    newDescription = newDescription.toUpperCase();
  }

  try {
    const promotion = await promotionModel.getDetail(promotionId);
    if (promotion.length == 0) {
      return res.status(404).json({
        error: "promotion not found",
      });
    }

    if (promotion[0].name !== newName) {
      const checkName = await promotionModel.findByName(newName);
      if (checkName.length > 0) {
        return res.status(400).json({
          error: "name already exists",
        });
      }
    }

    await promotionModel.updatePromotion(
      promotionId,
      newName,
      newPercent,
      newFromDate,
      newToDate,
      newDescription
    );

    return res.status(200).json({
      message: "promotion updated successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function deletePromotion(req, res) {
  const promotionId = req.params.id;

  if (Helper.checkNullOrEmpty(promotionId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const promotion = await promotionModel.getDetail(promotionId);
    if (promotion.length == 0) {
      return res.status(404).json({
        error: "promotion not found",
      });
    }

    await promotionModel.deletePromotion(promotionId);

    return res.status(200).json({
      message: "promotion deleted successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function apply(req, res) {
  const promotionId = req.body.id;
  const status = req.body.status;

  if (Helper.checkNullOrEmpty(promotionId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const promotion = await promotionModel.getDetail(promotionId);
    if (promotion.length == 0) {
      return res.status(404).json({
        error: "promotion not found",
      });
    }
    if (status == 1) {
      const fromDate = promotion[0].fromDate;
      const toDate = promotion[0].toDate;

      let vietnamTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      });
      let today = new Date(vietnamTime);

      let year = today.getFullYear();
      let month = (today.getMonth() + 1).toString().padStart(2, "0");
      let day = today.getDate().toString().padStart(2, "0");
      let currentDate = `${year}-${month}-${day}`;
      if (!(fromDate <= currentDate && toDate >= currentDate)) {
        return res.status(400).json({
          error: "Invalid application date",
        });
      }

      const percent = promotion[0].percent;
      await productModel.applyPromotion(percent);
      await promotionModel.apply(promotionId, status);
      return res.status(200).json({
        message: "promotion apply successfully",
      });
    } else if (status == 0) {
      await productModel.unApplyPromotion();
      await promotionModel.apply(promotionId, status);
      return res.status(200).json({
        message: "promotion unapply successfully",
      });
    }
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

module.exports = {
  getList,
  addNewPromotion,
  getDetail,
  updatePromotion,
  deletePromotion,
  apply,
};
