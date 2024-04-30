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

module.exports = { sendPasswordResetEmail };
