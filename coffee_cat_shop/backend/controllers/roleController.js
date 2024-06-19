const roleModel = require("../models/roleModel");
const Helper = require("../helper").Helper;

async function getList(req, res) {
  const { name, status, pageIndex, pageSize } = req.body;

  try {
    const roles = await roleModel.getList(name, status, pageIndex, pageSize);

    const total = await roleModel.getTotal(name, status);

    return res.status(200).json({
      data: {
        total: total[0].total,
        items: roles,
      },
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function addNewRole(req, res) {
  let { name, description } = req.body;

  if (Helper.checkNullOrEmpty(name)) {
    return res.status(400).json({
      error: "name is required",
    });
  }

  try {
    name = name.toUpperCase();
    const role = await roleModel.findByName(name);
    if (role.length > 0) {
      return res.status(400).json({
        error: "name already exists",
      });
    }

    await roleModel.addNewRole(name, description);

    return res.status(200).json({
      message: "add new role successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function getDetail(req, res) {
  const roleId = req.body.id;

  if (Helper.checkNullOrEmpty(roleId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const role = await roleModel.getDetail(roleId);
    if (role.length == 0) {
      return res.status(404).json({
        error: "role not found",
      });
    }

    return res.status(200).json({
      data: role[0],
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updateRole(req, res) {
  const roleId = req.body.id;
  let newName = req.body.name;
  const newDescription = req.body.description;
  const newStatus = req.body.status;

  if (Helper.checkNullOrEmpty(roleId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    newName = newName.toUpperCase();
    const role = await roleModel.getDetail(roleId);
    if (role.length == 0) {
      return res.status(404).json({
        error: "role not found",
      });
    }

    if (role[0].name !== newName) {
      const checkName = await roleModel.findByName(newName);
      if (checkName.length > 0) {
        return res.status(400).json({
          error: "name already exists",
        });
      }
    }

    await roleModel.updateRole(roleId, newName, newDescription, newStatus);

    return res.status(200).json({
      error: "role updated successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function deleteRole(req, res) {
  const roleId = req.body.id;

  if (Helper.checkNullOrEmpty(roleId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const role = await roleModel.getDetail(roleId);
    if (role.length == 0) {
      return res.status(404).json({
        error: "role not found",
      });
    }

    await roleModel.deleteRole(roleId);

    return res.status(200).json({
      message: "role deleted successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

module.exports = {
  getList,
  addNewRole,
  getDetail,
  updateRole,
  deleteRole,
};
