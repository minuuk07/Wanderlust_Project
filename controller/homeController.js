// controllers/homeController.js
// Show a front/home page using sample data as fallback

const initData = require('../init/data.js'); // adjust path if your data file sits elsewhere
const Listing = require('../models/listing'); // optional: real DB model

module.exports.home = async (req, res, next) => {
  try {
    // Try DB first (if you want live listings), otherwise fall back to init data
    let allListings = [];
    try {
      allListings = await Listing.find({}).limit(12).exec();
    } catch (err) {
      // If DB not available or empty, use sample data
      allListings = initData.data || [];
    }

    // If DB returned empty, fallback to sample data as well
    if (!allListings || allListings.length === 0) {
      allListings = initData.data || [];
    }

    res.render('home.ejs', { allListings });
  } catch (err) {
    next(err);
  }
};
