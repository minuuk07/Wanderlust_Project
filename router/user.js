const express=require("express");
const router=express.Router();
const User = require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const { route } = require("./listings");
const passport = require("passport");
const { saveRedirectUrl } = require("../meddlewear.js");
const userController=require("../controller/user.js");
// app.use(express.urlencoded({ extended: true }));

router.get("/signup", userController.randerSignup);

 router.post("/signup",   wrapAsync(userController.signup));

 router.get("/login",userController.randerLogin);

 router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash:true }), userController.login );

 router.get("/logout",userController.logout);

// this is for otp varification

router.get("/forgot-password", userController.renderForgotPassword);
router.post("/forgot-password", wrapAsync(userController.sendOtp));

router.get("/verify-otp", userController.renderOtpPage);
router.post("/verify-otp", wrapAsync(userController.verifyOtp));

router.get("/set-password", userController.renderSetPassword);
router.post("/set-password", wrapAsync(userController.setNewPassword));
module.exports = router;
module.exports=router;
