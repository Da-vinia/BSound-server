const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");
const { isAuthenticated } = require("./../../middleware/jwt.middleware");
 
const router = express.Router();
const saltRounds = 10;

router.get('/verify', isAuthenticated, (req, res, next) => {      
 
    console.log(`req.payload`, req.payload);
   
    res.status(200).json(req.payload);
  });


  module.exports = router;