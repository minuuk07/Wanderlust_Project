const Profile = require("../models/profile");
const User = require("../models/user");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { cloudinary } = require("../cloudeconfig");

// Show profile page
module.exports.showProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id });
        
        // If profile doesn't exist, create one
        if (!profile) {
            profile = new Profile({
                user: req.user._id,
                fullName: req.user.username
            });
            await profile.save();
        }

        // Get user statistics
        const totalBookings = await Booking.countDocuments({ user: req.user._id });
        const totalListings = await Listing.countDocuments({ owner: req.user._id });
        const recentBookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .sort({ createdAt: -1 })
            .limit(5);

        // ✅ FIXED: Using "profile" instead of "profile/show" because file is profile.ejs
        res.render("profile", {
            profile,
            user: req.user,
            totalBookings,
            totalListings,
            recentBookings
        });
    } catch (err) {
        console.error("Profile error:", err);
        req.flash("error", "Could not load profile");
        res.redirect("/listings");
    }
};

// Show edit profile form
module.exports.editProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });
        if (!profile) {
            req.flash("error", "Profile not found");
            return res.redirect("/profile");
        }
        // ✅ FIXED: Using "edit" if edit.ejs exists in views folder
        res.render("edit", { profile });
    } catch (err) {
        console.error("Edit profile error:", err);
        req.flash("error", "Could not load edit form");
        res.redirect("/profile");
    }
};

// Update profile
module.exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phone, bio, dateOfBirth, gender } = req.body;
        const { street, city, state, country, zipCode } = req.body.address || {};
        const { website, facebook, twitter, instagram } = req.body.socialLinks || {};
        const { language, currency, notifications } = req.body.preferences || {};

        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            profile = new Profile({ user: req.user._id });
        }

        // Update basic info
        profile.fullName = fullName || profile.fullName;
        profile.phone = phone || profile.phone;
        profile.bio = bio || profile.bio;
        profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
        profile.gender = gender || profile.gender;

        // Update address
        profile.address = {
            street: street || profile.address?.street || "",
            city: city || profile.address?.city || "",
            state: state || profile.address?.state || "",
            country: country || profile.address?.country || "",
            zipCode: zipCode || profile.address?.zipCode || ""
        };

        // Update social links
        profile.socialLinks = {
            website: website || profile.socialLinks?.website || "",
            facebook: facebook || profile.socialLinks?.facebook || "",
            twitter: twitter || profile.socialLinks?.twitter || "",
            instagram: instagram || profile.socialLinks?.instagram || ""
        };

        // Update preferences
        profile.preferences = {
            language: language || profile.preferences?.language || "English",
            currency: currency || profile.preferences?.currency || "INR",
            notifications: {
                email: notifications?.email === "on",
                sms: notifications?.sms === "on"
            }
        };

        profile.lastActive = Date.now();
        await profile.save();

        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
    } catch (err) {
        console.error("Update profile error:", err);
        req.flash("error", "Could not update profile");
        res.redirect("/profile/edit");
    }
};

// Update profile picture
module.exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            req.flash("error", "Please select an image");
            return res.redirect("/profile/edit");
        }

        const profile = await Profile.findOne({ user: req.user._id });

        // Delete old image from cloudinary (if not default)
        if (profile.profilePicture && profile.profilePicture.filename !== "default-profile") {
            await cloudinary.uploader.destroy(profile.profilePicture.filename);
        }

        // Update with new image
        profile.profilePicture = {
            url: req.file.path,
            filename: req.file.filename
        };

        await profile.save();

        req.flash("success", "Profile picture updated!");
        res.redirect("/profile");
    } catch (err) {
        console.error("Profile picture error:", err);
        req.flash("error", "Could not update profile picture");
        res.redirect("/profile/edit");
    }
};

// Get user statistics
module.exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const Wishlist = require("../models/wishlist");

        const totalSpent = await Booking.aggregate([
            { $match: { user: userId, paymentStatus: "Paid" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const stats = {
            totalBookings: await Booking.countDocuments({ user: userId }),
            totalSpent: totalSpent[0]?.total || 0,
            totalListings: await Listing.countDocuments({ owner: userId }),
            wishlistCount: await Wishlist.countDocuments({ user: userId })
        };

        res.json(stats);
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ error: "Could not fetch stats" });
    }
};

// Show user's bookings
module.exports.showUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("listing")
            .sort({ createdAt: -1 });

        // ✅ Using booking.ejs from views folder
        res.render("booking", { bookings });
    } catch (err) {
        console.error("Bookings error:", err);
        req.flash("error", "Could not load bookings");
        res.redirect("/profile");
    }
};

// Show user's listings
module.exports.showUserListings = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        // ✅ Using index.ejs from listings folder to show user's listings
        res.render("listings/index", { allListings: listings });
    } catch (err) {
        console.error("Listings error:", err);
        req.flash("error", "Could not load listings");
        res.redirect("/profile");
    }
};