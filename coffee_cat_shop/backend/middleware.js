const jwt = require("jsonwebtoken");

module.exports = {
  validateToken: (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token)
      return res.status(401).send("Access denied. No token provided.");
    else {
      if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      } else {
        return res.status(401).send("Access denied. No token provided.");
      }
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.userId;
      req.role = decoded.role;
      next();
    } catch (ex) {
      return res.status(403).send("Invalid token.");
    }
  },

  validateAdminToken: (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token)
      return res.status(401).send("Access denied. No token provided.");
    else {
      if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      } else {
        return res.status(401).send("Access denied. No token provided.");
      }
    }

    try {
      let adminRole = ["admin"];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!adminRole.includes(decoded.role)) {
        return res.status(403).send("Invalid token.");
      } else {
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
      }
    } catch (ex) {
      return res.status(403).send("Invalid token.");
    }
  },
};
