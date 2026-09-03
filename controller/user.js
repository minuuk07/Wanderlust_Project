const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");


// ===============================
// Render Signup
// ===============================
module.exports.randerSignup = (req, res) => {
  res.render("listings/home.ejs");
};


// ===============================
// Render Login
// ===============================
module.exports.randerLogin = (req, res) => {
  res.render("listings/home.ejs");
};


// ===============================
// Signup
// ===============================
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};


// ===============================
// Login
// ===============================
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  res.redirect(res.locals.redirectUrl || "/listings");
};


// ===============================
// Logout
// ===============================
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "You are logged out");
    res.redirect("/");
  });
};


// ===============================
// Forgot Password - Render Pages
// ===============================
module.exports.renderForgotPassword = (req, res) => {
  res.render("users/forgot");
};

module.exports.renderOtpPage = (req, res) => {
  res.render("users/verifyOtp");
};

module.exports.renderSetPassword = (req, res) => {
  res.render("users/setPassword");
};


// ===============================
// Send OTP
// ===============================
module.exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/forgot-password");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendEmail(email, otp);

    req.session.resetEmail = email;

    req.flash("success", "OTP sent to your email");
    res.redirect("/verify-otp");

  } catch (err) {
    console.log("Send OTP Error:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/forgot-password");
  }
};


// ===============================
// Verify OTP
// ===============================
module.exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.resetEmail;

    if (!email) {
      req.flash("error", "Session expired");
      return res.redirect("/forgot-password");
    }

    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
      req.flash("error", "Invalid or Expired OTP");
      return res.redirect("/verify-otp");
    }

    res.redirect("/set-password");

  } catch (err) {
    console.log("Verify OTP Error:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/forgot-password");
  }
};


// ===============================
// Set New Password (FIXED)
// ===============================
module.exports.setNewPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.session.resetEmail;

    if (!email) {
      req.flash("error", "Session expired. Try again.");
      return res.redirect("/forgot-password");
    }

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/forgot-password");
    }

    // Update password using passport-local-mongoose
    await user.setPassword(password);

    // Clear OTP
    user.resetOtp = null;
    user.otpExpiry = null;

    await user.save();

    // Clear session
    req.session.resetEmail = null;

    req.flash("success", "Password reset successful");
    res.redirect("/login");

  } catch (err) {
    console.log("Reset Password Error:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/forgot-password");
  }
};
