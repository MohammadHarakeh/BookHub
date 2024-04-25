const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multerMiddleware = require("../middleware/multerMiddleware");

const { updateProfile, createPost } = require("../controller/user");

router.post("/updateProfile", authMiddleware, updateProfile);

router.post("/createPost", multerMiddleware, createPost);

module.exports = router;
