//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//connection
mongoose.connect("mongodb://0.0.0.0:27017/userdb", { useNewUrlParser: true });

//user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//mongoose model
const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

//register new user
app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });

    
});

//login route
app.post("/login", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else
            bcrypt.compare(password, foundUser.password, (err, result)=>{
                if (result === true){
                    res.render("secrets");
                }
            });
    });
});

app.get("/logout", (req, res) => {
    res.redirect("/");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));