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
  profile: {
    bio: String,
    location: String,
    profile_picture: String,
    linkedin_link: String,
    instagram_link: String,
    twitter_link: String,
  },
});

module.exports = mongoose.model("User", userSchema);
