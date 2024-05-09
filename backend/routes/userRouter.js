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
} = require("../controller/user");

router.get("/getLoggedinUser", authMiddleware, getLoggedinUser);
router.get("/getAllUsers", authMiddleware, getAllUsers);
router.post("/updateProfile", authMiddleware, updateProfile);
router.post("/googleLogin", googleLogin);
router.post("/followUser/:followeeId", authMiddleware, followUser);

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
} = require("../controller/email");

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/invite-to-repository", authMiddleware, inviteToRepository);
router.post(
  "/accept-invitation-to-repository",
  authMiddleware,
  acceptInvitationToRepository
);

const {
  createRepository,
  uploadRepositoryContent,
  getVersionsDifference,
  compareAnyVersion,
  getRepository,
  synchronizeCollaboratorsRepositories,
} = require("../controller/repository");

router.get("/getRepository/:repositoryId", authMiddleware, getRepository);
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
  async (req, res) => {
    try {
      const { repositoryId, versionId } = req.params;

      const userId = req.user._id;

      await compareAnyVersion(userId, repositoryId, versionId);

      res.status(200).json({ message: "Comparison done successfully" });
    } catch (error) {
      console.error("Error comparing versions:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
router.post("/repositories/:repositoryId/synchronize", async (req, res) => {
  const { repositoryId } = req.params;

  try {
    await synchronizeCollaboratorsRepositories(repositoryId);
    return res.status(200).json({
      message: "Collaborators repositories synchronized successfully",
    });
  } catch (error) {
    console.error("Error synchronizing collaborators repositories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
