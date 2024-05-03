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
    const { name, email, picture } = req.body; // Assuming picture is also sent from frontend

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = new User({
        username: name,
        email,
        // Optionally, save the profile picture
        profile: {
          profile_picture: picture, // Assuming picture is the URL of the profile picture
        },
      });

      await user.save();
    } else {
      user.username = name;
      await user.save();
    }
    user.isGoogleLogin = true;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    await user.save();

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in with Google" });
  }
}

const getLoggedinUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const jwtToken = token.split("Bearer ")[1];

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error verifying JWT token", error);
    console.log(jwtToken);
    return res.status(401).json({ message: "Invalid token" });
  }
};

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

const followUser = async (req, res) => {
  try {
    const { followeeId } = req.body;
    const followerId = req.user._id;

    const followee = await User.findById(followeeId);
    if (!followee) {
      return res.status(404).json({ message: "Followee not found" });
    }

    const alreadyFollowing = followee.followers.some(
      (follower) => follower.followeeId.toString() === followerId.toString()
    );

    if (alreadyFollowing) {
      followee.followers = followee.followers.filter(
        (follower) => follower.followeeId.toString() !== followerId.toString()
      );

      await followee.save();

      return res
        .status(200)
        .json({ message: "You unfollowed the user", followee });
    } else {
      followee.followers.push({ followeeId: followerId });
      await followee.save();

      return res
        .status(200)
        .json({ message: "You followed the user", followee });
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    res.status(500).json({ message: "Failed to follow user", error });
  }
};

module.exports = {
  updateProfile,
  googleLogin,
  followUser,
  getLoggedinUser,
};
