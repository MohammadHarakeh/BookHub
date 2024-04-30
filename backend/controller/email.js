const User = require("../models/User");
const { sendPasswordResetEmail } = require("../utils/email");

const generatePIN = () => {
  return Math.floor(10000000 + Math.random() * 90000000);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
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
  }
};

const resetPassword = async (req, res) => {
  const { email, pin, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordPIN !== pin ||
      user.resetPasswordPINExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired PIN" });
    }

    user.password = newPassword;

    user.resetPasswordPIN = undefined;
    user.resetPasswordPINExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { forgotPassword, resetPassword };
