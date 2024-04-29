const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
});

const sendPasswordResetEmail = async (to, username, token) => {
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to,
    subject: "Password Reset Request",
    text: `Dear ${username},\n\nSomeone has requested to reset your password. If this wasn't you, please change your password immediately. If this was you, click the link below to reset your password:\n\nhttp://localhost3000/reset-password?token=${token}\n\nBest Regards,\nBookHub Support`,
    html: `<p>Dear ${username},</p><p>Someone has requested to reset your password. If this wasn't you, please change your password immediately. If this was you, click the link below to reset your password:</p><p><a href="http://localhost3000/reset-password?token=${token}">Reset Password</a></p><p>Best Regards,<br>BookHub Support</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

module.exports = { sendPasswordResetEmail };
