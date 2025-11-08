// controllers/homeController.js

const initData = require("../init/data.js");
const Listing = require("../models/listing");

module.exports.home = async (req, res) => {
  let allListings = [];

  try {
    allListings = await Listing.find({}).limit(12);
  } catch (err) {
    console.log("DB not connected, using sample data.");
    allListings = initData.data;
  }

  res.render("home.ejs", { allListings });
};

// 🔍 Filter by Category
module.exports.filterByCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();
  let listings = [];

  try {
    listings = await Listing.find({ category: category });
  } catch (err) {
    listings = (initData.data || []).filter(
      (item) => item.category && item.category.toLowerCase() === category
    );
  }

  res.render("filterResult.ejs", { listings, category });
};

