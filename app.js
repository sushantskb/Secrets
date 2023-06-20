//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//code position is important
app.use(session({
    secret: "Privacy is primary.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//connection
mongoose.connect("mongodb://0.0.0.0:27017/userdb", { useNewUrlParser: true });
//to get rid of depricated warning
mongoose.set("useCreateIndex", true);

//user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//code positioning is important
userSchema.plugin(passportLocalMongoose);


//mongoose model
const User = mongoose.model("User", userSchema);

//code positioning is important
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/secrets", (req, res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.render("login");
    }
});

app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        res.redirect("/");
    });
});

//register new user
app.post("/register", (req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user)=>{
        if(err){ 
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/secrets");
            });
        }
    });
});

//login route
app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            })
        }
    });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));