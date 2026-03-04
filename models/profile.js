const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "" },
        zipCode: { type: String, default: "" }
    },
    bio: {
        type: String,
        default: "",
        maxlength: 500
    },
    profilePicture: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/demo/image/upload/v1/default-profile.png"
        },
        filename: {
            type: String,
            default: "default-profile"
        }
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["", "Male", "Female", "Other", "Prefer not to say"],
        default: ""
    },
    socialLinks: {
        website: { type: String, default: "" },
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" }
    },
    preferences: {
        language: { type: String, default: "English" },
        currency: { type: String, default: "INR" },
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        }
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);