const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {reviewSchema}=require("../schema.js");
const review=require("../models/review.js");
const listing=require("../models/listing.js");
// this is for comment and review
const {validatereview, isLoggedin,isReviewAthor}=require("../meddlewear.js");

const reviewController=require("../controller/review.js");

// this review riute
router.post("/", isLoggedin,validatereview, wrapAsync(reviewController.createReview));
//  this is delete route
router.delete("/:reviewId",  isLoggedin,isReviewAthor,wrapAsync(reviewController.reviewDelete));
module.exports=router;