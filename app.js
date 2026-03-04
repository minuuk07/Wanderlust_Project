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
const sendBookingMail = require("./utils/sendMail");

// this is create when using ejs file
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);
app.use(express.urlencoded({extended:true}));
app.use(method("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

const listingController = require("./controller/listings.js");

// MongoDB connection
main().then(()=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongo);
}

// Session store configuration
const store = MongoStore.create({
    mongoUrl: mongo,
    crypto: {
        secret: "jdfhdsjkfh",
        touchAfter: 24 * 3600,
    }
});

store.on("error", (err) => {
    console.log("error in mongo session store", err);
});

const sessionOption = {
    store: store,
    secret: "gjilgdsf",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },
};

// ============================================
// IMPORTANT: ORDER OF MIDDLEWARE MATTERS!
// ============================================

// 1. Session middleware (must come before passport)
app.use(session(sessionOption));
app.use(flash());

// 2. Passport middleware (must come after session)
app.use(passport.initialize());
app.use(passport.session());

// 3. Passport configuration
passport.use(new LocalStratigy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// 4. ✅ CRITICAL: This middleware MUST be here - sets up locals for ALL views
app.use((req, res, next) => {
    console.log("Setting up locals - req.user:", req.user ? req.user.username : "No user");
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  // This makes currUser available in ALL templates
    res.locals.wishlistCount = 0;     // Default value
    next();
});

// 5. Wishlist count middleware (optional, runs after user is set)
app.use(async (req, res, next) => {
    if (req.user) {
        try {
            const Wishlist = require("./models/wishlist");
            const count = await Wishlist.countDocuments({ user: req.user._id });
            res.locals.wishlistCount = count;
            console.log("Wishlist count for user:", count);
        } catch (err) {
            console.error("Error getting wishlist count:", err);
            res.locals.wishlistCount = 0;
        }
    }
    next();
});

// 6. Routes (must come AFTER all middleware)
app.use("/listings", listingrouter);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/", userRouter);
app.use("/profile", require("./router/profile"));

// 7. 404 handler
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Foundddddd"));
});

// 8. Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8080, () => {
    console.log("listing is start port is 8080");
});
