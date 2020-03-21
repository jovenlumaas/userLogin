//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

console.log(process.env.API_KEY);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/secretsDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
      email: String,
      password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

////////////////////// HOME ROUTE //////////////////////////////////
app.route("/")
  .get(function(req, res){
    res.render("home");
  });

  ////////////////////// REGISTER ROUTE //////////////////////////////////
  app.route("/register")
    .get(function(req, res){
        res.render("register");
    })

    .post(function(req, res){
      newUser = new User({
        email: req.body.username,
        password: req.body.password
      });
      newUser.save(function(err){
          if (!err){
            res.redirect("/secrets");
          } else {
            res.send(err);
          }
      });

    });

////////////////////// LOGIN ROUTE //////////////////////////////////
app.route("/login")
  .get(function(req, res){
      res.render("login");
  })

  .post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
      if (!foundUser) {
        res.send("Email is not registered.");
      } else {
        if (foundUser){
          if (foundUser.password === password){
            res.redirect("/secrets");
          } else {
            res.send("Email and password did not match! Please try again.")
          }
        }
      }
    });
  });

  ////////////////////// LOGOUT ROUTE //////////////////////////////////
  app.route("/logout")
    .get(function(req, res){
      res.redirect("/");
    });

////////////////////// SECRETS ROUTE //////////////////////////////////
app.route("/secrets")
  .get(function(req, res){
      res.render("secrets");
  })

  .post(function(req, res){
    res.render("submit");
  });

  ////////////////////// SUBMIT ROUTE //////////////////////////////////
  app.route("/submit")
    .get(function(req, res){
        res.render("submit");
    })

    .post(function(req, res){
      res.redirect("/secrets");
    });










app.listen(3000, function(){
  console.log("The server is running on port 3000...");
})
