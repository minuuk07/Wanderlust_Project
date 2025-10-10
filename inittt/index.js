const mongoose=require("mongoose");
const initdata=require("./data.js");
const listings=require("../models/listing.js");
main().then(()=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
const initdb=async()=>{
    await listings.deleteMany({});
     
   initdata.data= initdata.data.map((obj)=>({...obj, owner:'68e58d54d26b0010bb6e00f7'}));

    await listings.insertMany(initdata.data);
    console.log("data was init");
}
initdb();