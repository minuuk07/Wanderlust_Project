// routes/index.js
const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const listing=require("../models/listing.js");
const homeController = require("../controller/homeController.js");

// router.get("/", homeController.home);
router.get("/filter/:category", homeController.filterByCategory);

module.exports = router;



