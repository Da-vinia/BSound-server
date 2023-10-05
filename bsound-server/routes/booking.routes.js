const router = require('express').Router();
const mongoose = require('mongoose');
const User = require("../models/User.model");
const Product = require('../models/Product.model');
const Booking = require("../models/Booking.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");


// const checkAvailability = async (req, res, next) => {
//     try {
//       const { productId, startDate, endDate } = req.body;
  
//       if (!mongoose.Types.ObjectId.isValid(productId)) {
//         res.status(400).json({ message: 'Product not found.' });
//         return;
//       }
  
//       const product = await Product.findById(productId);
  
//       if (!product) {
//         res.status(404).json({ message: 'Product not found.' });
//         return;
//       }
  
//       const isDateAvailable = product.bookedDates.every((booking) => {
//         return (
//           startDate >= booking.endDate || endDate <= booking.startDate
//         );
//       });
  
//       if (!isDateAvailable) {
//         return res.status(400).json({ message: 'Days are not available' });
//       }
  
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error verifiying the available dates.' });
//     }
//   };

// POST - user creates a booking
// router.post('/', isAuthenticated,  (req, res, next) => {
//     const { startDate, endDate, totalPrice, productBooked } = req.body;
//     const booker = req.payload._id; 

//     const newBooking = new Booking({
//         startDate,
//         endDate,
//         totalPrice,
//         booker,
//         productBooked,
//     });

//     newBooking.save()
//         .then(async (booking) => {
//             const product = await Product.findById(productBooked);
//             product.bookedDates.push({ startDate, endDate });
//             await product.save();
            
//             res.status(201).json(booking);
//         })
//         .catch((error) =>
//             res.status(500).json({ message: 'Error creating the booking', error })
//         );
//   });
//         .then((booking) => res.status(201).json(booking))
//         .catch((error) => res.status(500).json({ message: "Error creating the booking", error }));
// });

// 

router.post('/', isAuthenticated, async (req, res, next) => {
    const { startDate, endDate, totalPrice, productBooked ,} = req.body;
    const booker = req.payload._id;


    console.log("ID ID ID ID ID ",productBooked    )
    console.log('1. gettin the route');
    
    try {
        console.log('2. Details received:', startDate, endDate, totalPrice, productBooked);

        const newBooking = new Booking({
            startDate,
            endDate,
            totalPrice,
            booker,
            productBooked,
        });

        console.log('3. Booking saved in the database');
        const savedBooking = await newBooking.save();

        console.log('4. Looking for the product in the data...');
        const productToUpdate = await Product.findById(productBooked).select('contactDetails');

        if (!productToUpdate) {
            console.error('Product not found in database.');
            res.status(404).json({ message: 'Product not found in the database.' });
            return;
        }

        console.log('5. Product not found in the database:', productToUpdate);

        if (!productToUpdate.bookedDates) {
            productToUpdate.bookedDates = [];
        }

        productToUpdate.bookedDates.push({ startDate, endDate });
        await productToUpdate.save();

        console.log('6. Product updated with the selected dates');
        console.log("zzzzzzzz",savedBooking , "kkkkkkkk", productToUpdate)
        res.status(201).json({savedBooking:savedBooking,
        productToUpdate: productToUpdate });
    } catch (error) {
        console.error('Error al crear el booking:', error);
        res.status(500).json({ message: 'Error creating the booking', error });
    }
});

module.exports = router;