const User = require("../models/User");
const {
  sendPasswordResetEmail,
  sendRepositoryInvitationEmail,
} = require("../utils/email");
const bcrypt = require("bcrypt");

const generatePIN = () => {
  return Math.floor(10000000 + Math.random() * 90000000);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    User.schema.path("password").required(false);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pin = generatePIN();

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    user.resetPasswordPIN = pin;
    user.resetPasswordPINExpires = expiryDate;

    await user.save();

    await sendPasswordResetEmail(email, user.username, pin);

    return res.status(200).json({ message: "Password reset PIN sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    User.schema.path("password").required(true);
  }
};

const resetPassword = async (req, res) => {
  const { email, pin, newPassword } = req.body;

  try {
    User.schema.path("password").required(false);

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordPIN !== pin ||
      user.resetPasswordPINExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired PIN" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordPIN = undefined;
    user.resetPasswordPINExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password: ", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    User.schema.path("password").required(true);
  }
};

const generateInvitationToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24);
  return { token, expiresAt: expirationTime };
};

const inviteToRepository = async (req, res) => {
  const { userId, email, repositoryName } = req.body;

  try {
    const invitingUser = req.user;

    if (!invitingUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToInvite._id.equals(invitingUser._id)) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    const repository = invitingUser.repositories.find(
      (repo) => repo.name === repositoryName
    );

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (
      repository.pendingInvitations.some((invitation) =>
        invitation.userId.equals(userToInvite._id)
      ) ||
      repository.invitedUsers.includes(userToInvite._id)
    ) {
      return res
        .status(400)
        .json({ message: "User already invited or a member" });
    }

    const { token, expiresAt } = generateInvitationToken();

    repository.pendingInvitations.push({
      userId: userToInvite._id,
      invitationToken: token,
      expiresAt: expiresAt,
    });

    await invitingUser.save();

    const invitingUsername = invitingUser.username;
    const invitingProfilePicture = invitingUser.profile.profile_picture;

    await sendRepositoryInvitationEmail(
      email,
      repositoryName,
      invitingUsername,
      token
    );

    userToInvite.invitedFields = {
      invitingUserId: invitingUser._id,
      invitationToken: token,
      invitationTokenExpires: expiresAt,
      invitingUsername: invitingUsername,
      invitingProfilePicture: invitingProfilePicture,
    };

    await userToInvite.save();

    return res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error inviting user to repository:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const acceptRepositoryInvitation = async (req, res) => {
  const { repositoryId } = req.params;
  const user = req.user;

  try {
    const repository = await Repository.findById(repositoryId);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (!repository.invitedUsers.includes(user._id)) {
      return res
        .status(403)
        .json({ message: "You are not invited to this repository" });
    }

    repository.invitedUsers.push(user._id);
    await repository.save();

    return res
      .status(200)
      .json({ message: "Invitation accepted successfully" });
  } catch (error) {
    console.error("Error accepting repository invitation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  inviteToRepository,
  acceptRepositoryInvitation,
};
