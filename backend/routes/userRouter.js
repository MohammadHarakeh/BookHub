const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multerMiddleware = require("../middleware/multerMiddleware");

const {
  updateProfile,
  createPost,
  getAllPosts,
} = require("../controller/user");

router.post("/updateProfile", authMiddleware, updateProfile);

router.post("/createPost", multerMiddleware, createPost);
router.get("/getAllPosts", getAllPosts);

module.exports = router;
