
 const User=require("../models/user");
// this is  rander sign up
module.exports.randerSignup=(req,res)=>{
    res.render("users/signup.ejs")
};
// this is rander log in from

module.exports.randerLogin=(req, res)=>{
    res.render("users/login.ejs");
 };
// post route
module.exports.signup=async(req, res)=>{
    try{
const { username, email, password } = req.body;
console.log(req.body); 
const newUser = new User({ username, email });

   const registerUser=await User.register(newUser, password);
   console.log(registerUser);
   req.login(registerUser,(err)=>{
   if(err){
    return next(err);
   }
   req.flash("success", "wellcome to wanderlust");
   res.redirect("/listings");
   })
  
        
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }

 };

 module.exports.login=async(req, res)=>{
  req.flash("success","wellcome back to wanderlust");
  res.redirect(res.locals.redirectUrl || "/listings");

 };

 module.exports.logout=(req, res,next)=>{
req.logOut((err)=>{
  if(err){
   return next(err);
  }
  req.flash("success", "you are logged out");
  res.redirect("/listings");
})
 };