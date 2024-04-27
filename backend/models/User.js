const mongoose = require("mongoose");

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
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profile: {
    bio: {
      type: String,
      default: "",
      maxlength: 255,
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
  },
});

module.exports = mongoose.model("User", userSchema);
