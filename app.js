//jshint esversion:6
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//connection
mongoose.connect("mongodb://0.0.0.0:27017/userdb",{useNewUrlParser: true});

//user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//code of encryption
const secret = "privacy";
userSchema.plugin(encrypt,{secret: secret, encryptedFields: ["password"]});

//mongoose model
const User = mongoose.model("User",userSchema);

app.get('/', (req, res) => {
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

//register new user
app.post("/register",(req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err)=>{
        if(err){
            console.log(err);
        } else{
            res.render("secrets");
        }
    });
});

//login route
app.post("/login", (req, res)=>{
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName},(err, foundUser)=>{
        if(err){
            console.log(err);
        } else 
            if(foundUser){
                if(foundUser.password === password){
                res.render("secrets");
            }
        }
    });
});

app.get("/logout",(req, res)=>{
    res.render("home");
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));