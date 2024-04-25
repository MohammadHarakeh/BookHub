const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { register, login, updateProfile } = require("../controller/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/updateProfile", authMiddleware, updateProfile);

module.exports = router;
