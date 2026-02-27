const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const listing=require("../models/listing.js");
const {isLoggedin, isOwner,validateListing}=require("../meddlewear.js");
const listingController=require("../controller/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudeconfig.js");
const upload = multer({ storage });
// multer cannot take nested name like listing[image][url] this type
// this is restructring router.route
router.get("/filter/:category", listingController.filterByCategory);
router.get("/:id/upi", (listingController.showUpi));
router.get(
    "/:id/success",
    isLoggedin,
    wrapAsync(listingController.bookingSuccess)
);
router.get(
    "/mybooking",
    isLoggedin,
    wrapAsync(listingController.showMyLatestBooking)
);
// after payment success

router.get(
    "/:id/payment-success",
    isLoggedin,
    wrapAsync(listingController.paymentSuccess)
);

router.route("/")
// index route
  .get(wrapAsync(listingController.index))
 
  // show route
  .post(isLoggedin,  upload.single('listing[image]'), validateListing,wrapAsync(listingController.createListing)
);

// creae a new pos
router.get("/new", isLoggedin,listingController.randerNewForm);
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedin, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteListing));

// here create edit route
router.get("/:id/edit", isLoggedin,isOwner,wrapAsync(listingController.editListing));

router.get("/:id/booking", isLoggedin,wrapAsync(listingController.renderBookingForm));
router.post("/:id/booking", isLoggedin, wrapAsync(listingController.createBooking));


// filter route






module.exports=router;
