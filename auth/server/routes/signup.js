const express = require("express");
const User = require("../../db/index.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");

dotenv.config({ path: "./.env" });

const signup = async (req, res) => {
  const response = await User.find({ email: req.body.email });
  if (response.length > 0) {
    res.send("exist");
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      username: req.body.username,
      password: hash,
      email: req.body.email,
      role: req.body.role,
    });
    const user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
    jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
      res.send(token);
    });
  }
};

module.exports = signup;