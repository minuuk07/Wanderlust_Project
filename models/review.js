const { string } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;


const reviewsSchema=new schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5

    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    athor:{
  type: schema.Types.ObjectId,
   ref:"User",
    },
});
module.exports=mongoose.model("review" , reviewsSchema);
