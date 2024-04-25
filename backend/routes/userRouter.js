const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { updateProfile } = require("../controller/user");

router.post("/updateProfile", authMiddleware, updateProfile);

module.exports = router;
