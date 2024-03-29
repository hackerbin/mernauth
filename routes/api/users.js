const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
      return res.status(400).json(errors);
  }

  User.findOne({email: req.body.email}).then(user => {
      if(user){
          return res.status(400).json({email: "Email already exists"});
      } else {
          cons newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if(err) throw err;
                  newUser.password = hash;
                  newUser
                  .save()
                  .then(user=>res.json(user))
                  .catch(err => console.log(err));
              });
          });
      }
  });
});
