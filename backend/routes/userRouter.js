const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multerMiddleware = require("../middleware/multerMiddleware");

const {
  updateProfile,
  googleLogin,
  followUser,
  getLoggedinUser,
  getAllUsers,
  getFollowedUser,
} = require("../controller/user");

router.get("/getLoggedinUser", authMiddleware, getLoggedinUser);
router.get("/getAllUsers", authMiddleware, getAllUsers);
router.post(
  "/updateProfile",
  authMiddleware,
  multerMiddleware.profilePictureUpload,
  updateProfile
);
router.post("/googleLogin", googleLogin);
router.post("/followUser/:followeeId", authMiddleware, followUser);
router.get("/getFollowedUser", authMiddleware, getFollowedUser);

const {
  createPost,
  getAllPosts,
  deletePost,
  toggleLike,
  addComment,
  toggleCommentLike,
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
router.post(
  "/toggleCommentLike/:postId/:commentId",
  authMiddleware,
  toggleCommentLike
);
router.post("/addComment/:postId", authMiddleware, addComment);

const {
  forgotPassword,
  resetPassword,
  inviteToRepository,
  acceptInvitationToRepository,
  declineInvitationToRepository,
} = require("../controller/email");

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/invite-to-repository", authMiddleware, inviteToRepository);
router.post(
  "/accept-invitation-to-repository",
  authMiddleware,
  acceptInvitationToRepository
);
router.post(
  "/decline-invitation-to-repository",
  authMiddleware,
  declineInvitationToRepository
);

const {
  createRepository,
  uploadRepositoryContent,
  getVersionsDifference,
  compareAnyVersion,
  getRepository,
  synchronizeCollaboratingRepositoryInfo,
  generateImage,
  getCollaboratingRepositoryInfo,
  generateText,
  toggleStarRepo,
  fetchStarredRepos,
} = require("../controller/repository");

router.get("/getRepository/:repositoryId", authMiddleware, getRepository);
router.get(
  "/collaborating-repos/:repositoryId",
  authMiddleware,
  getCollaboratingRepositoryInfo
);
router.post(
  "/createRepository",
  authMiddleware,
  multerMiddleware.repoPictureUpload,
  createRepository
);
router.post(
  "/uploadRepositoryContent/:repositoryId",
  authMiddleware,
  uploadRepositoryContent
);
router.get(
  "/versionDifference/:repositoryId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const repositoryId = req.params.repositoryId;

      await getVersionsDifference(userId, repositoryId);

      res
        .status(200)
        .json({ message: "Versions difference printed successfully" });
    } catch (error) {
      console.error("Error printing versions difference:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
router.get(
  "/versionDifference/:repositoryId/:versionId",
  authMiddleware,
  compareAnyVersion
);

router.post(
  "/repositories",
  authMiddleware,
  synchronizeCollaboratingRepositoryInfo
);

router.post("/generateImage", generateImage);
router.post("/generateText", generateText);
router.post("/toggleStarRepo/:repositoryId", authMiddleware, toggleStarRepo);
router.get("/starredRepos", authMiddleware, fetchStarredRepos);

module.exports = router;
