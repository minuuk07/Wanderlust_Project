const mongoose = require("mongoose");
const review = require("./review");
const schema = mongoose.Schema;
const reviews=require("./review.js");
const { types } = require("joi");
const listingschema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String
    // filename: {
    //   type: String,
    //   default: "listingimage",
    // },
    // url: {
    //   type: String,
    //   default:
    //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3wxJ0c-jC6VcDASO9aiDWD9zWAeJLKrS5gg&s",
    //   set: (v) =>
    //     v === ""
    //       ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3wxJ0c-jC6VcDASO9aiDWD9zWAeJLKrS5gg&s"
    //       : v,
    // },
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:schema.Types.ObjectId,
      ref:"review",
    }
  ],
 owner: {
  type: schema.Types.ObjectId,
  ref: "User" 
},
geometry: {
    type: {
      type: String,
      enum: ['Point'], // geometry.type must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  
  },
   category: {
    type: String,
   required:true,
  }
});

  




listingschema.post("findOneAndDelete", async(listing)=>{
  if(listing){
await review.deleteMany({_id: {$in: listing.reviews}});
  }
  
})
const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
