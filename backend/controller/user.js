const User = require("../models/User");
const jwt = require("jsonwebtoken");
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
      return res.status(404).json({ message: "User not found" });
    }

    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (linkedin_link !== undefined) user.profile.linkedin_link = linkedin_link;
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
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = user.posts;
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

const createPost = async (req, res) => {
  try {
    const userId = req.user._id;

    let content = req.body.content || null;
    let image = req.file ? req.file.path : null;

    if (!content && !image) {
      return res.status(400).json({ message: "Content or image is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = { content, image };
    user.posts.push(post);
    await user.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = user.posts.id(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.remove();
    await user.save();

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
