
 const User=require("../models/user");
// this is  rander sign up
module.exports.randerSignup=(req,res)=>{
    res.render("users/signup.ejs")
};
// this is rander log in from

module.exports.randerLogin=(req, res)=>{
    res.render("users/login.ejs");
 };
// post route
module.exports.signup=async(req, res)=>{
    try{
const { username, email, password } = req.body;
console.log(req.body); 
const newUser = new User({ username, email });

   const registerUser=await User.register(newUser, password);
   console.log(registerUser);
   req.login(registerUser,(err)=>{
   if(err){
    return next(err);
   }
   req.flash("success", "wellcome to wanderlust");
   res.redirect("/listings");
   })
  
        
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }

 };

 module.exports.login=async(req, res)=>{
  req.flash("success","wellcome back to wanderlust");
  res.redirect(res.locals.redirectUrl || "/listings");

 };

 module.exports.logout=(req, res,next)=>{
req.logOut((err)=>{
  if(err){
   return next(err);
  }
  req.flash("success", "you are logged out");
  res.redirect("/listings");
})
 };

// this is for forgot password
const sendEmail = require("../utils/sendEmail");

module.exports.renderForgotPassword = (req, res) => {
  res.render("users/forgot");
};

module.exports.renderOtpPage = (req, res) => {
  res.render("users/verifyOtp");
};

module.exports.renderSetPassword = (req, res) => {
  res.render("users/setPassword");
};

module.exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/forgot-password");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  await sendEmail(email, otp);

  req.session.resetEmail = email;

  req.flash("success", "OTP sent to your email");
  res.redirect("/verify-otp");
};

module.exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.session.resetEmail;

  const user = await User.findOne({ email });

  if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
    req.flash("error", "Invalid or Expired OTP");
    return res.redirect("/verify-otp");
  }

  res.redirect("/set-password");
};

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

   
    await user.setPassword(password);

    // Clear OTP fields
    user.resetOtp = null;
    user.otpExpiry = null;

    await user.save();

    
    req.session.resetEmail = null;

    req.flash("success", "Password reset successful");
    res.redirect("/login");

  } catch (err) {
    console.log("Reset Password Error:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/forgot-password");
  }
};
