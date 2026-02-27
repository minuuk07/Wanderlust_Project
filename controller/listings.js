// this is index route
const Listing = require("../models/listing");
// const listing=require("../models/listing");
const booking = require("../models/booking");
const listing = require("../models/listing");
const listings=require("../models/listing.js");
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const Booking = require("../models/booking");
// const Listing = require("../models/listing");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});
module.exports.index=async(req,res)=>{
  const allListings= await listing.find({});
  // folder name dite hole ./ dite hobe
  res.render("./listings/index.ejs", {allListings});
};
// this is new form
module.exports.randerNewForm=(req, res)=>{
  
  res.render("./listings/new.ejs");
}

// this is show route
module.exports.showListing=async(req, res)=>{
  let {id}=req.params;
const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "athor",
    }
  })
  .populate("owner");
   
   if(!listing){
    req.flash("error", "listing does not exist");
    return res.redirect("/listings");
   }
   console.log(listing.owner);
   console.log(listing.athor);
  res.render("./listings/show.ejs",{listing});
};


// this is create ropute post listing
// module.exports.createListing=async (req,res,next)=>{
//  let url=req.file.path;
//  let filename=req.file.filename;
//   //  let newListing = new Listing(req.body.listing); 

//   //  newListing.owner=req.user._id;
//   //  await newListing.save();
//    req.flash("success", "new listing created");
//   res.redirect("/listings");
  
// };

module.exports.createListing = async (req, res, next) => {
  // this is map related coding
 let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()

  // res.send("done");

  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
listing.geometry = response.body.features[0].geometry; 
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
      
    };
    
  }

  let saveListing=await listing.save();
  console.log(saveListing);
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${listing._id}`);
};

// this is edit from route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_200,w_250");

  res.render("./listings/edit.ejs", { listing, originalImage });
};


// this is update route
const { cloudinary } = require("../cloudeconfig.js");

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  if (req.file) {
    
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};


// this is delete route 
module.exports.deleteListing=async(req, res)=>{
  let {id}=req.params;
  let deleteed=await Listing.findByIdAndDelete(id);
     req.flash("success", "listing is deleted");

  res.redirect("/listings");
};

// work search btn
module.exports.index = async (req, res) => {
  try {
    const { search } = req.query;
    let allListings;

    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i"); // case-insensitive
      allListings = await Listing.find({
        $or: [
          { title: regex },
          { location: regex },
          { country: regex }
        ],
      });
    } else {
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// here booking funtion work
// Show Booking Form
module.exports.renderBookingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/booking.ejs", { listing });
};

// Create Booking
module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    const { name, email, adults, children, checkIn, checkOut } = req.body;

    const totalDays = Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = totalDays * listing.price;

    const newBooking = new Booking({
        listing: listing._id,
        user: req.user._id,
        name,
        email,
        adults,
        children,
        checkIn,
        checkOut,
        totalDays,
        totalPrice
    });

    await newBooking.save();

    req.flash("success", "Booking successful!");
    res.redirect(`/listings`);
};
