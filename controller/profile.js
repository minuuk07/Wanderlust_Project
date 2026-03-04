const Profile = require("../models/profile");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { cloudinary } = require("../cloudeconfig");

// ============================
// SHOW PROFILE
// ============================

module.exports.showProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({
        user: req.user._id,
        fullName: req.user.username
      });
      await profile.save();
    }

    const totalBookings = await Booking.countDocuments({ user: req.user._id });
    const totalListings = await Listing.countDocuments({ owner: req.user._id });

    const recentBookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 })
      .limit(5);

    res.render("profile", {
      profile,
      user: req.user,
      totalBookings,
      totalListings,
      recentBookings
    });

  } catch (err) {
    console.log(err);
    req.flash("error", "Could not load profile");
    res.redirect("/listings");
  }
};


// ============================
// EDIT PROFILE PAGE
// ============================

module.exports.editProfile = async (req, res) => {
  try {

    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({
        user: req.user._id
      });
      await profile.save();
    }

    res.render("listings/editprofile", { profile });

  } catch (err) {
    console.log(err);
    req.flash("error", "Could not load edit page");
    res.redirect("/profile");
  }
};


// ============================
// UPDATE PROFILE
// ============================

module.exports.updateProfile = async (req, res) => {
  try {

    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    const { fullName, phone, bio, dateOfBirth, gender } = req.body;

    profile.fullName = fullName;
    profile.phone = phone;
    profile.bio = bio;
    profile.dateOfBirth = dateOfBirth;
    profile.gender = gender;

    // Address
    profile.address = {
      street: req.body["address[street]"],
      city: req.body["address[city]"],
      state: req.body["address[state]"],
      country: req.body["address[country]"],
      zipCode: req.body["address[zipCode]"]
    };

    // Social links
    profile.socialLinks = {
      website: req.body["socialLinks[website]"],
      facebook: req.body["socialLinks[facebook]"],
      twitter: req.body["socialLinks[twitter]"],
      instagram: req.body["socialLinks[instagram]"]
    };

    // Image upload
    if (req.file) {

      if (profile.profilePicture && profile.profilePicture.filename !== "default-profile") {
        await cloudinary.uploader.destroy(profile.profilePicture.filename);
      }

      profile.profilePicture = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    profile.lastActive = Date.now();

    await profile.save();

    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");

  } catch (err) {
    console.log(err);
    req.flash("error", "Could not update profile");
    res.redirect("/profile/edit");
  }
};
