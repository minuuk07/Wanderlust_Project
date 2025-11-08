// controllers/homeController.js

const initData = require("../init/data.js");
const Listing = require("../models/listing");

// 🏠 Home Page Controller
module.exports.home = async (req, res) => {
  let allListings = [];

  try {
    allListings = await Listing.find({}).limit(12);
  } catch (err) {
    console.log("DB not connected, using sample data.");
    allListings = initData.data;
  }

  // 👉 home.ejs ফাইল render হবে
  res.render("home.ejs", { allListings });
};

// 🔍 Filter by Category Controller
module.exports.filterByCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();
  let listings = [];

  try {
    listings = await Listing.find({ category: category });
  } catch (err) {
    // যদি database error হয়, sample data থেকে খোঁজ করবে
    listings = (initData.data || []).filter(
      (item) => item.category && item.category.toLowerCase() === category
    );
  }

  // ✅ এখানেই তুমি এই লাইনটা রাখবে:
  // filterResult.ejs ফাইল render করার জন্য
  res.render("filterResult.ejs", { listings, category });
};
