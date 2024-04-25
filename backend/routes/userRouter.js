const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multerMiddleware = require("../middleware/multerMiddleware");

const {
  updateProfile,
  createPost,
  getAllPosts,
  deletePost,
} = require("../controller/user");

router.post("/updateProfile", authMiddleware, updateProfile);

router.get("/getAllPosts", getAllPosts);
router.post("/createPost", multerMiddleware.postUpload, createPost);
router.delete("/deletePost/:postId", authMiddleware, deletePost);

module.exports = router;
