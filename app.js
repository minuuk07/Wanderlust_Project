if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}

console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose=require("mongoose");


const mongo="mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.ATLASDB_URL;
const listing=require("./models/listing.js");
const path=require("path");
const { url } = require("inspector");
const method=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const review=require("./models/review.js");
const listingrouter=require("./router/listings.js");
const reviewrouter=require("./router/reviews.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratigy=require("passport-local");
const user=require("./models/user.js");
const userRouter=require("./router/user.js");
const { error } = require('console');
const indexRouter = require("./router/index.js");
// this is create when you using ejs file
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(method("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
 
const store=MongoStore.create({
  // change here full change
   mongoUrl:dburl,
   crypto:{
  secret: process.env.SECRET,
  touchAfter:24*3600,
   }
})

store.on("error", ()=>{
  console.log("error in mongo session store", err);
})
const sessionOption = {
  store:store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
  httpOnly:true
  },
};
// app.get("/",  (req, res)=>{
//     res.send("success");
// });

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// here may comes to error
passport.use(new LocalStratigy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUSer=req.user;
next();
});
// this create mongo db server 
main().then(()=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));
// change here
async function main() {
  await mongoose.connect(dburl);
}

app.use("/listings", listingrouter);

app.use("/listings/:id/reviews", reviewrouter);
app.use("/", userRouter);
app.use("/", indexRouter);

// this is root route




app.listen(8080,()=>{
    console.log("listing is start port is 8080");
});


app.all(/.*/, (req, res, next) => {
   next(new ExpressError(404, "Page Not Foundddddd"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message});
  // res.status(statusCode).send(message);
});



