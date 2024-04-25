const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

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

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { register, login, updateProfile };
