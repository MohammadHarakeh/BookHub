const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
});

const sendPasswordResetEmail = async (to, token) => {
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to,
    subject: "Password Reset Request",
    text: `You have requested to reset your password. Click the link below to reset your password:\n\nhttp://localhost3000/reset-password?token=${token}`,
    html: `<p>You have requested to reset your password. Click the link below to reset your password:</p><p><a href="http://localhost3000/reset-password?token=${token}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

module.exports = { sendPasswordResetEmail };
