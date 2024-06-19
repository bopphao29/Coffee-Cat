require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },

  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(user) {
    let token = jwt.sign(
      {
        userId: user.userId,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { algorithm: "HS256", expiresIn: "24h" }
    );

    return token;
  },

  generateAdminToken(user) {
    let adminToken = jwt.sign(
      {
        userId: user.userId,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { algorithm: "HS256", expiresIn: "24h" }
    );

    return adminToken;
  },

  stringToInt(value) {
    if (value === null || value === "null" || value === "") {
      return null;
    } else if (value === undefined || value === "undefined") {
      return undefined;
    } else {
      return parseInt(value);
    }
  },

  parseInt(value) {
    if (value === null || value == undefined) {
      return 0;
    } else {
      return parseInt(value);
    }
  },

  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  },

  checkNullOrEmpty(value) {
    if (value === null || value === undefined) {
      return true;
    } else if (typeof value === "string" || typeof value === "undefined") {
      return value === "undefined" ||
        value === "null" ||
        Object.keys(value).length === 0
        ? true
        : false;
    } else if (typeof value === "number") {
      return value === null;
    } else if (Array.isArray(value)) {
      return value.length === 0;
    } else return false;
  },

  isNumeric(num) {
    return !isNaN(num);
  },

  checkPhoneNumber(phone) {
    return phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);
  },

  dbErrorReturn(err, res) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  },

  badRequestReturn(err, res) {
    return res.status(400).json({
      error: err,
    });
  },

  async getRole(req) {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;
      const role = decoded.role;
      const data = { userId: userId, role: role };
      return data;
    } catch (err) {
      return null;
    }
  },
};

module.exports = {
  Helper,
};
