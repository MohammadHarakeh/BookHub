const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
});

const sendPasswordResetEmail = async (to, username, pin) => {
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to,
    subject: "Password Reset Request",
    text: `Dear ${username},\n\nSomeone has requested to reset your password. If this wasn't you, please change your password immediately. If this was you, use the following PIN to reset your password: ${pin}\n\nBest Regards,\nBookHub Support`,
    html: `<p>Dear ${username},</p><p>Someone has requested to reset your password. If this wasn't you, please change your password immediately. If this was you, use the following PIN to reset your password: <strong>${pin}</strong></p><p>Best Regards,<br>BookHub Support</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

const sendRepositoryInvitationEmail = async (
  to,
  repositoryName,
  invitingUsername
) => {
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to,
    subject: "Invitation to join a repository",
    text: `Dear ${to},\n\nYou have been invited by ${invitingUsername} to join the repository "${repositoryName}". Click on the link to accept the invitation.\n\nBest Regards,\nBookHub Team`,
    html: `<p>Dear ${to},</p><p>You have been invited by ${invitingUsername} to join the repository "<strong>${repositoryName}</strong>". Click <a href="#">here</a> to accept the invitation.</p><p>Best Regards,<br>BookHub Team</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Repository invitation email sent");
  } catch (error) {
    console.error("Error sending repository invitation email: ", error);
  }
};

module.exports = { sendPasswordResetEmail, sendRepositoryInvitationEmail };
