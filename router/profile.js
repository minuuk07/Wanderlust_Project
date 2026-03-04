const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedin } = require("../meddlewear");
const profileController = require("../controller/profile");
const multer = require('multer');
const { storage } = require("../cloudeconfig");
const upload = multer({ storage });

// Profile routes
router.get("/", isLoggedin, wrapAsync(profileController.showProfile));
router.get("/edit", isLoggedin, wrapAsync(profileController.editProfile));
router.post("/update", isLoggedin, wrapAsync(profileController.updateProfile));
router.post("/update-picture", isLoggedin, upload.single('profilePicture'), wrapAsync(profileController.updateProfilePicture));

// User statistics
router.get("/stats", isLoggedin, wrapAsync(profileController.getUserStats));

// User bookings and listings
router.get("/bookings", isLoggedin, wrapAsync(profileController.showUserBookings));
router.get("/listings", isLoggedin, wrapAsync(profileController.showUserListings));

module.exports = router;