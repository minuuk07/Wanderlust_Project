
const listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview=async (req, res) => {
  let listingData = await listing.findById(req.params.id);
  let newreview = new review(req.body.review);
   newreview.athor=req.user._id;
   console.log(newreview);
  listingData.reviews.push(newreview);
  await newreview.save();
  await listingData.save();

  console.log("Review is saved");
       req.flash("success", "review are created");

  res.redirect(`/listings/${listingData._id}`);
};

module.exports.reviewDelete=async (req, res) => {
  let { id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);

  console.log("Review deleted successfully");
    req.flash("success", "review is deleted");

 return res.redirect(`/listings/${id}`);
};