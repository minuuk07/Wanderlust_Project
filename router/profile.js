const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedin } = require("../meddlewear");
const profileController = require("../controller/profile");

const multer = require("multer");
const { storage } = require("../cloudeconfig");
const upload = multer({ storage });

/* ==============================
   PROFILE MAIN PAGE
============================== */

router.get(
"/",
isLoggedin,
wrapAsync(profileController.showProfile)
);

/* ==============================
   EDIT PROFILE PAGE
============================== */

router.get(
"/edit",
isLoggedin,
wrapAsync(profileController.editProfile)
);

/* ==============================
   UPDATE PROFILE
============================== */

router.post(
"/update",
isLoggedin,
upload.single("profilePicture"),
wrapAsync(profileController.updateProfile)
);

/* ==============================
   UPDATE PROFILE PICTURE
============================== */

router.post(
"/update-picture",
isLoggedin,
upload.single("profilePicture"),
wrapAsync(profileController.updateProfilePicture)
);

/* ==============================
   USER STATISTICS
============================== */

router.get(
"/stats",
isLoggedin,
wrapAsync(profileController.getUserStats)
);

/* ==============================
   USER BOOKINGS
============================== */

router.get(
"/bookings",
isLoggedin,
wrapAsync(profileController.showUserBookings)
);

/* ==============================
   USER LISTINGS
============================== */

router.get(
"/listings",
isLoggedin,
wrapAsync(profileController.showUserListings)
);

module.exports = router;
