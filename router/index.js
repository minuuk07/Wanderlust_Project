// // router/index.js
// const express = require("express");
// const router = express.Router();
// const homeController = require("../controller/homeController.js");

// router.get("/", homeController.home);
// router.get("/filter/:category", homeController.filterByCategory);

// module.exports = router;

// router/listings.js

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

// Existing routes here...

// 🆕 Filter route
router.get("/filter/:category", wrapAsync(async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category: { $regex: new RegExp(category, "i") } });

  if (!listings || listings.length === 0) {
    req.flash("error", "No listings found for this category");
    return res.redirect("/listings");
  }

  res.render("listings/filterResult.ejs", { listings, category });
}));

module.exports = router;
