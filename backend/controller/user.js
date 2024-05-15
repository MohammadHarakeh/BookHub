const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multerMiddleware = require("../middleware/multerMiddleware");
const multer = require("multer");

async function googleLogin(req, res) {
  try {
    const { name, email, picture } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email,
        profile: {
          profile_picture: picture,
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

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find(
      { _id: { $ne: loggedInUserId } },
      `username profile.profile_picture followers`
    ).lean();

    for (let user of users) {
      if (Array.isArray(user.followers)) {
        const isFollowing = user.followers.some(
          (follower) =>
            follower.followeeId.toString() === loggedInUserId.toString()
        );
        user.following = isFollowing;
      } else {
        user.following = false;
      }
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
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
    const followeeId = req.params.followeeId;
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

const getFollowedUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const followers = await User.find(
      { "followers.followeeId": currentUserId },
      { _id: 1, username: 1, "profile.profile_picture": 1 }
    );

    const currentUser = await User.findById(currentUserId);
    const followingUsers = followers.map((follower) => follower._id);
    currentUser.following = followingUsers;
    await currentUser.save();

    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  updateProfile,
  googleLogin,
  followUser,
  getLoggedinUser,
  getAllUsers,
  getFollowedUser,
};
