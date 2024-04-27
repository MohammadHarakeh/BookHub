const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multerMiddleware = require("../middleware/multerMiddleware");
const multer = require("multer");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
const bcrypt = require("bcryptjs");

async function googleLogin(req, res) {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        username: name,
        email,
        password: hashedPassword,
      });

      await user.save();
    } else {
      user.username = name;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in with Google" });
  }
}

const updateProfile = async (req, res) => {
  try {
    multerMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "File upload failed" });
      }
    });

    const { bio, location, linkedin_link, instagram_link, twitter_link } =
      req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (bio !== undefined) user.profile.bio = bio;
      if (location !== undefined) user.profile.location = location;
      if (profile_picture !== undefined)
        user.profile.profile_picture = profile_picture;
      if (linkedin_link !== undefined)
        user.profile.linkedin_link = linkedin_link;
      if (instagram_link !== undefined)
        user.profile.instagram_link = instagram_link;
      if (twitter_link !== undefined) user.profile.twitter_link = twitter_link;

      if (req.file) {
        const oldProfilePicturePath = user.profile.profile_picture;
        const newProfilePicturePath = req.file.path;

        if (oldProfilePicturePath) {
          fs.unlinkSync(oldProfilePicturePath);
        }

        user.profile.profile_picture = newProfilePicturePath;
      }

      await user.save();

      res.status(200).json({ message: "Profile updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    let content = req.body.content || null; // Content is optional
    let image = req.file ? req.file.path : null; // Image is optional

    // If neither content nor image is provided, return an error
    if (!content && !image) {
      return res.status(400).json({ message: "Content or image is required" });
    }

    const post = new Post({ userId, content, image });

    await post.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.userId.equals(req.user._id)) {
      console.log("Post ID: ", post.userId);
      console.log("User ID: ", req.user._id);
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only delete your own posts" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete post", error });
  }
};

module.exports = {
  updateProfile,
  createPost,
  getAllPosts,
  deletePost,
  googleLogin,
};
