const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Unauthenticated");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded.userId);
    if (!decoded || !decoded.userId)
      return res.status(401).send("Unauthenticated");

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).send("Unauthenticated");

    req.user = user;
    next();
  } catch (error) {
    console.log("Internal server error:", error);
    return res.status(500).send("Internal server error.");
  }
};
module.exports = authMiddleware;
