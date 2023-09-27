const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");
 
const router = express.Router();
const saltRounds = 10;

router.post('/signup', (req, res, next) => {
    const { email, password, name } = req.body;

    if (email === '' || password === '' || name === '') {
        res.status(400).json({ message: "All the fields are mandatory. Please provide name, email and password" });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Please provide a valid email address.' });
            return;
        }
    
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
            return;
        }
    
    User.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            return User.create({ email, password: hashedPassword, name });
        })
        .then((createdUser) => {
            const { email, name, _id } = createdUser;
            const user = { email, name, _id };
            res.status(201).json({ user: user });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
        });
});

module.exports = router;