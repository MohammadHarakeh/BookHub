const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: String,
  senderProfilePicture: {
    type: String,
    default: "",
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientName: String,
  recipientProfilePicture: {
    type: String,
    default: "",
  },
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invitationToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const versionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const repositorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  repo_picture: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  styles: {
    fontStyle: String,
    fontSize: String,
    fontColor: String,
    fontWeight: String,
    textDecoration: String,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    required: true,
  },
  invitedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  collaborators: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      senderUsername: String,
      receiverUsername: String,
      senderRepoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      receiverRepoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  starred: Boolean,
  versions: [versionSchema],
});

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
      username: String,
      profile_picture: {
        type: String,
        default: "",
      },
      content: String,
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
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
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.isPasswordRequired && !this.isGoogleLogin;
    },
  },
  resetPasswordPIN: String,
  resetPasswordPINExpires: Date,

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
  repositories: [repositorySchema],
  invitations: [invitationSchema],

  collaboratingRepositories: [
    {
      senderRepoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
      },
      receiverRepoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
      },
    },
  ],
});

userSchema.virtual("isPasswordRequired").get(function () {
  return (
    !this.resetPasswordPIN &&
    !this.resetPasswordPINExpires &&
    !this.isGoogleLogin
  );
});

module.exports = mongoose.model("User", userSchema);
