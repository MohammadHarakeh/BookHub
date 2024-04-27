const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multerMiddleware = require("../middleware/multerMiddleware");

const {
  updateProfile,
  createPost,
  getAllPosts,
  deletePost,
  googleLogin,
} = require("../controller/user");

router.post("/updateProfile", authMiddleware, updateProfile);
router.post("/googleLogin", googleLogin);

router.get("/getAllPosts", getAllPosts);
router.post(
  "/createPost",
  authMiddleware,
  multerMiddleware.postUpload,
  createPost
);
router.delete("/deletePost/:postId", authMiddleware, deletePost);

module.exports = router;
