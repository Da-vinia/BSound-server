const router = require('express').Router();
const mongoose = require('mongoose');
const User = require("../models/User.model");
const Product = require('../models/Product.model');
const Booking = require("../models/Booking.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");


const checkAvailability = async (req, res, next) => {
    try {
      const { productId, startDate, endDate } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({ message: 'Product not found.' });
        return;
      }
  
      const product = await Product.findById(productId);
  
      if (!product) {
        res.status(404).json({ message: 'Product not found.' });
        return;
      }
  
      const isDateAvailable = product.bookedDates.every((booking) => {
        return (
          startDate >= booking.endDate || endDate <= booking.startDate
        );
      });
  
      if (!isDateAvailable) {
        return res.status(400).json({ message: 'Days are not available' });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error verifiying the available dates.' });
    }
  };

// POST - user creates a booking
router.post('/', isAuthenticated, checkAvailability, (req, res, next) => {
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
        .then(async (booking) => {
            const product = await Product.findById(productBooked);
            product.bookedDates.push({ startDate, endDate });
            await product.save();
            
            res.status(201).json(booking);
        })
        .catch((error) =>
            res.status(500).json({ message: 'Error creating the booking', error })
        );
  });
//         .then((booking) => res.status(201).json(booking))
//         .catch((error) => res.status(500).json({ message: "Error creating the booking", error }));
// });

// 

module.exports = router;