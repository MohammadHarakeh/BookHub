const express = require("express");
const router = express.Router();
const middleware = require("../middleware/authMiddleware");

router.get("/", middleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

module.exports = router;
