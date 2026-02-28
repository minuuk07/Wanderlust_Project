// const listing=require("./models/listing.js");
const Listing = require("./models/listing");
const review = require("./models/review");

const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/expressError.js");
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
    req.flash("error", "you must be loggedin ");
   return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl=(req, res, next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;

  }
  next();
};
// this  is swoing medlewear 



module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission ");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// this is listing meddlewear
module.exports.validateListing=(req,res,next)=>{
  const { error } = listingSchema.validate(req.body);
    console.log(req.body);

  if (error) {
    const errMessage = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMessage);
  } else {
    next();
  }
};

// this is reviews meddlewear
module.exports.validatereview=(req,res,next)=>{
  const { error } = reviewSchema.validate(req.body);
    console.log(req.body);

  if (error) {
    const errMessage = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMessage);
  } else {
    next();
  }
};


// this is for delete review
module.exports.isReviewAthor = async (req, res, next) => {
  let { id,reviewId } = req.params;
  const revieww = await review.findById(reviewId);

  if (!revieww.athor.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission ");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
