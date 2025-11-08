// controllers/homeController.js
const initData = require("../init/data.js");
const Listing = require("../models/listing");
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
// Home Page Controller

res.send("page worked successfylly");
module.exports.home = async (req, res) => {
  let allListings = [];
  try {
    allListings = await Listing.find({}).limit(12);
  } catch (err) {
    console.log("DB not connected, using sample data.");
    allListings = initData.data;
  }
  // NOTE: your view lives in views/listings/index.ejs
  res.render("listings/index.ejs", { allListings });
};

// Filter by Category Controller
module.exports.filterByCategory = async (req, res) => {
  // const category = String(req.params.category || "").toLowerCase().trim();
  // let listings = [];

  // try {
  //   listings = await Listing.find({ category: category });
  // } catch (err) {
  //   listings = (initData.data || []).filter(
  //     (item) => item.category && item.category.toLowerCase() === category
  //   );
  // }

  // // Render the view that exists at views/listings/filterResult.ejs
  // res.render("listings/filterResult.ejs", { listings, category });

   const { category:category } = req.params;
  const listings = await Listing.find({ category: { $regex: new RegExp(category, "i") } });

  if (!listings || listings.length === 0) {
    req.flash("error", "No listings found for this category");
    return res.redirect("/listings");
  }

  res.render("listings/filterResult.ejs", { listings, category });
};



