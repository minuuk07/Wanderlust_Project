const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    adults: {
        type: Number,
        required: true,
        min: 1
    },

    children: {
        type: Number,
        default: 0,
        min: 0
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    totalDays: {
        type: Number,
        required: true,
        min: 1
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Cancelled"],
        default: "Pending"
    }

}, { timestamps: true });  // 🔥 Automatically adds createdAt & updatedAt


module.exports = mongoose.model("Booking", bookingSchema);
