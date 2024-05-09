const User = require("../models/User");
const {
  sendPasswordResetEmail,
  sendRepositoryInvitationEmail,
} = require("../utils/email");
const bcrypt = require("bcrypt");

const generatePIN = () => {
  return Math.floor(10000000 + Math.random() * 90000000);
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

const inviteToRepository = async (req, res) => {
  const { repositoryId, recipientEmail } = req.body;

  try {
    const sender = req.user;
    const recipient = await User.findOne({ email: recipientEmail });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient user not found" });
    }

    const { token, expiresAt } = generateInvitationToken();

    const invitation = {
      sender: sender._id,
      senderName: sender.username,
      senderProfilePicture: sender.profile.profile_picture,
      recipient: recipient._id,
      recipientName: recipient.username,
      recipientProfilePicture: recipient.profile.profile_picture,
      repositoryId,
      invitationToken: token,
      expiresAt,
    };

    sender.invitations.push(invitation);
    recipient.invitations.push(invitation);

    await sender.save();
    await recipient.save();

    await sendRepositoryInvitationEmail(
      sender.email,
      sender.username,
      recipientEmail,
      token,
      repositoryId
    );

    return res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error inviting user to repository:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const acceptInvitationToRepository = async (req, res) => {
  const { invitationToken } = req.body;
  const user = req.user;

  try {
    const invitationIndex = user.invitations.findIndex(
      (invite) => invite.invitationToken === invitationToken
    );

    if (invitationIndex === -1) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    const invitation = user.invitations[invitationIndex];

    if (invitation.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invitation has expired" });
    }

    const sender = await User.findById(invitation.sender);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const senderRepo = sender.repositories.find(
      (repo) => repo._id.toString() === invitation.repositoryId.toString()
    );
    if (!senderRepo) {
      return res.status(404).json({ message: "Sender's repository not found" });
    }

    const newRepository = { ...senderRepo.toObject() };
    delete newRepository._id; // Remove _id field
    newRepository.createdAt = new Date();

    newRepository.collaborators = [
      {
        _id: sender._id,
        senderUsername: sender.username,
        senderRepoId: invitation.repositoryId,
        receiverUsername: user.username,
      },
    ];

    if (!user.repositories) {
      user.repositories = [];
    }
    user.repositories.push(newRepository);
    await user.save();

    const receiverRepoId = user.repositories[user.repositories.length - 1]._id;

    newRepository.collaborators.forEach((collaborator) => {
      collaborator.receiverRepoId = receiverRepoId;
    });

    user.collaboratingRepositories.push({
      receiverRepoId: receiverRepoId,
      senderRepoId: invitation.repositoryId,
    });
    await user.save();

    sender.collaboratingRepositories.push({
      receiverRepoId: receiverRepoId,
      senderRepoId: invitation.repositoryId,
    });
    await sender.save();

    sender.repositories.forEach((repo) => {
      if (!repo.collaborators) {
        repo.collaborators = [];
      }
      const existingCollaborator = repo.collaborators.find(
        (collab) => collab._id.toString() === sender._id.toString()
      );
      if (!existingCollaborator) {
        repo.collaborators.push(newRepository.collaborators[0]);
      }
      repo.collaborators.forEach((collaborator) => {
        if (collaborator._id.toString() === sender._id.toString()) {
          collaborator.receiverRepoId = receiverRepoId;
        }
      });
    });

    user.invitations.splice(invitationIndex, 1);
    sender.invitations.splice(invitationIndex, 1);
    await Promise.all([user.save(), sender.save()]);

    return res
      .status(200)
      .json({ message: "Invitation accepted successfully" });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  inviteToRepository,
  acceptInvitationToRepository,
};
