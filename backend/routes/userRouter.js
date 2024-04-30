const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multerMiddleware = require("../middleware/multerMiddleware");

const {
  updateProfile,
  googleLogin,
  followUser,
  getLoggedinUser,
} = require("../controller/user");

router.get("/getLoggedinUser", authMiddleware, getLoggedinUser);
router.post("/updateProfile", authMiddleware, updateProfile);
router.post("/googleLogin", googleLogin);
router.post("/followUser", authMiddleware, followUser);

const {
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  addComment,
} = require("../controller/post");

router.get("/getAllPosts", getAllPosts);
router.post(
  "/createPost",
  authMiddleware,
  multerMiddleware.postUpload,
  createPost
);
router.delete("/deletePost/:postId", authMiddleware, deletePost);
router.post("/toggleLike/:postId", authMiddleware, toggleLike);
router.post("/addComment/:postId", authMiddleware, addComment);

const { forgotPassword, resetPassword } = require("../controller/email");

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
