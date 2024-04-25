const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const jwt = require("jsonwebtoken");

const updateProfile = async (req, res) => {
  try {
    const {
      bio,
      location,
      profile_picture,
      linkedin_link,
      instagram_link,
      twitter_link,
    } = req.body;

    console.log(req.body);

    const userId = req.user._id;

    console.log(userId);

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

      await user.save();

      res.status(200).json({ message: "Profile updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
};

const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { content } = req.body;
    const image = req.file.path;

    const post = new Post({ userId, content, image });

    await post.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};

module.exports = { updateProfile };
