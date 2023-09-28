const router = require('express').Router();
const User = require("../models/User.model");
const Product = require('../models/Product.model');
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST - user creates a booking
router.post('/', isAuthenticated, (req, res, next) => {
    const { startDate, endDate, totalPrice, productBooked } = req.body;
    const booker = req.payload._id; 

    const newBooking = new Booking({
        startDate,
        endDate,
        totalPrice,
        booker,
        productBooked,
    });

    newBooking.save()
        .then((booking) => res.status(201).json(booking))
        .catch((error) => res.status(500).json({ message: "Error creating the booking", error }));
});







module.exports = router;