const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  profile_picture: {
    type: String,
    default: "",
  },
  linkedin_link: {
    type: String,
    default: "",
  },
  instagram_link: {
    type: String,
    default: "",
  },
  twitter_link: {
    type: String,
    default: "",
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: [profileSchema],
});

module.exports = mongoose.model("User", userSchema);
