const jwt = require("jsonwebtoken");
const JWT_SECRET = "MY_SECRET_KEY";

exports.authenticate = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ message: "Token Missing" });

  const token = header.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access restricted to Admin only" });
  next();
};

exports.JWT_SECRET = JWT_SECRET;
