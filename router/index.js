// routes/index.js
const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController.js");

router.get("/", homeController.home);
router.get("/filter/:category", homeController.filterByCategory);

module.exports = router;
