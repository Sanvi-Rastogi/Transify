const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "transitOS_secret_2024";

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token)
    return res.status(401).json({ success: false, message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token invalid" });
  }
};

exports.schedulerOnly = (req, res, next) => {
  if (req.user?.role !== "scheduler")
    return res
      .status(403)
      .json({ success: false, message: "Scheduler access only" });
  next();
};

exports.generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
