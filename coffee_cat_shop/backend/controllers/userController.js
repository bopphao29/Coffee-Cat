const userModel = require("../models/userModel");
const Helper = require("../helper").Helper;
const cartModel = require("../models/cartModel");

async function signUp(req, res) {
  let { phone, password, confirmPassword, fullname, email, address } = req.body;
  let validate = [];

  if (Helper.checkNullOrEmpty(phone)) {
    validate.push("phone is required");
  } else if (!Helper.checkPhoneNumber(phone)) {
    validate.push("phone is invalid");
  }
  if (Helper.checkNullOrEmpty(fullname)) {
    validate.push("fullname is required");
  } else {
    fullname = fullname.toUpperCase();
  }
  if (email && !Helper.isValidEmail(email)) {
    validate.push("email is invalid");
  }
  if (Helper.checkNullOrEmpty(address)) {
    validate.push("address is required");
  } else {
    address = address.toUpperCase();
  }
  if (Helper.checkNullOrEmpty(password)) {
    validate.push("password is required");
  }
  if (Helper.checkNullOrEmpty(confirmPassword)) {
    validate.push("confirm password is required");
  }
  if (password !== confirmPassword) {
    validate.push("password and confirm password do not match");
  }

  if (Object.keys(validate).length > 0) {
    return res.status(400).json({ error: validate });
  }

  try {
    const checkPhone = await userModel.findByPhone(phone);
    if (checkPhone.length > 0) {
      return res.status(400).json({ error: "phone already exists" });
    }

    if (email) {
      const checkEmail = await userModel.findByEmail(email);
      if (checkEmail.length > 0) {
        return res.status(400).json({ error: "email already exists" });
      }
    }

    const hashPassword = Helper.hashPassword(password);
    const newUser = await userModel.createUser(
      phone,
      fullname,
      email,
      address,
      hashPassword
    );

    await cartModel.insertCart(newUser.insertId);

    return res.status(201).json({
      message: "sign up successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function signIn(req, res) {
  const { phone, password } = req.body;
  let validate = [];

  if (Helper.checkNullOrEmpty(phone)) {
    validate.push("phone is required");
  }

  if (Helper.checkNullOrEmpty(password)) {
    validate.push("password is required");
  }

  if (Object.keys(validate).length > 0) {
    return res.status(400).json({ error: validate });
  }

  try {
    const user = await userModel.findByPhone(phone);
    if (user.length > 0) {
      let roleAdmin = [1];
      if (Helper.comparePassword(user[0].password, password)) {
        let token = "";
        if (roleAdmin.includes(user.roleId)) {
          token = Helper.generateAdminToken(user[0]);
        } else {
          token = Helper.generateToken(user[0]);
        }

        return res
          .status(200)
          .header("Authorization", token)
          .json({
            token,
            data: {
              userId: user[0].userId,
              role: user[0].role,
              phone: user[0].phone,
              fullname: user[0].fullname,
              email: user[0].email,
              address: user[0].address,
              status: user[0].status,
            },
          });
      } else {
        return res.status(400).json({ error: "password incorrect" });
      }
    } else {
      return res.status(400).json({ error: "phone incorrect" });
    }
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function changePassword(req, res) {
  const decodedToken = await Helper.getRole(req);
  let userId = "";
  if (decodedToken != null) {
    userId = decodedToken.userId;
  }
  const { oldPassword, newPassword, confirmPassword } = req.body;
  let validate = [];

  if (Helper.checkNullOrEmpty(oldPassword)) {
    validate.push("old password is required");
  }
  if (Helper.checkNullOrEmpty(newPassword)) {
    validate.push("new password is required");
  }
  if (Helper.checkNullOrEmpty(confirmPassword)) {
    validate.push("confirm password is required");
  }
  if (newPassword !== confirmPassword) {
    validate.push("new password and confirm password do not match");
  }

  if (Object.keys(validate).length > 0) {
    return res.status(400).json({ error: validate });
  }

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    if (!Helper.comparePassword(user[0].password, oldPassword)) {
      return res.status(400).json({ error: "old password is incorrect" });
    }

    const hashPassword = Helper.hashPassword(newPassword);
    await userModel.changePassword(user[0].id, hashPassword);

    return res.status(200).json({
      message: "password changed successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function getInfo(req, res) {
  const decodedToken = await Helper.getRole(req);
  let userId = "";
  if (decodedToken != null) {
    userId = decodedToken.userId;
  }

  try {
    const user = await userModel.getInfo(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    return res.status(200).json({
      data: user[0],
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updateInfo(req, res) {
  const decodedToken = await Helper.getRole(req);
  let userId = "";
  if (decodedToken != null) {
    userId = decodedToken.userId;
  }
  let { phone, fullname, email, address } = req.body;
  let validate = [];

  if (phone && !Helper.checkPhoneNumber(phone)) {
    validate.push("phone is invalid");
  }
  if (email && !Helper.isValidEmail(email)) {
    validate.push("email is invalid");
  }

  if (Object.keys(validate).length > 0) {
    return res.status(400).json({ error: validate });
  }

  if (!Helper.checkNullOrEmpty(fullname)) {
    fullname = fullname.toUpperCase();
  }
  if (!Helper.checkNullOrEmpty(address)) {
    address = address.toUpperCase();
  }

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    await userModel.updateInfo(userId, phone, fullname, email, address);

    return res.status(200).json({
      message: "user information updated successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function getList(req, res) {
  const { phone, fullname, address, status, roleId, pageIndex, pageSize } =
    req.body;

  try {
    const users = await userModel.getList(
      phone,
      fullname,
      address,
      status,
      roleId,
      pageIndex,
      pageSize
    );

    const total = await userModel.getTotal(
      phone,
      fullname,
      address,
      status,
      roleId
    );

    // return res.status(200).json({
    //   data: {
    //     total: total[0].total,
    //     items: users,
    //   },
    // });
    return res.status(200).json(users);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function getDetail(req, res) {
  // const userId = req.body.id;
  const userId = req.params.id;

  if (Helper.checkNullOrEmpty(userId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const user = await userModel.getDetail(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    return res.status(200).json(user[0]);
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function deleteUser(req, res) {
  // const userId = req.body.id;
  const userId = req.params.id;

  if (Helper.checkNullOrEmpty(userId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    await userModel.deleteUser(userId);

    return res.status(200).json({
      message: "user deleted successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updateStatus(req, res) {
  const userId = req.body.id;
  let status = req.body.status;

  if (Helper.checkNullOrEmpty(userId)) {
    return res.status(400).json({ error: "id is required" });
  }

  if (status == "false") {
    status = 0;
  } else if (status == "true") {
    status = 1;
  }

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    await userModel.updateStatus(userId, status);

    return res.status(200).json({
      message: "user updated status successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

async function updateRole(req, res) {
  const userId = req.body.id;
  const roleId = req.body.roleId;

  if (Helper.checkNullOrEmpty(userId)) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const user = await userModel.findById(userId);
    if (user.length == 0) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    await userModel.updateRole(userId, roleId);

    return res.status(200).json({
      message: "user updated role successfully",
    });
  } catch (error) {
    return Helper.dbErrorReturn(error, res);
  }
}

module.exports = {
  signUp,
  signIn,
  changePassword,
  getInfo,
  updateInfo,
  getList,
  getDetail,
  deleteUser,
  updateStatus,
  updateRole,
};
