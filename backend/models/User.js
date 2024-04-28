const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: String,
  image: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const followSchema = new mongoose.Schema({
  followeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  posts: [postSchema],
  followers: [followSchema],
});

module.exports = mongoose.model("User", userSchema);
