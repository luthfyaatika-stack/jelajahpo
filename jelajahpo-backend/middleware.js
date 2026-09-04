const jwt = require("jsonwebtoken");

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Silakan login terlebih dahulu",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  jwt.verify(token, "RAHASIA", (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token tidak valid",
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authJWT;