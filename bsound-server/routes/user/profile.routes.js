const router = require('express').Router();
const User = require("../../models/User.model");
const Product = require('../../models/Product.model');
const Booking = require("../../models/Booking.model");
const Listings = require("../../models/Listings.model");
const fileUploader = require("../../config/cloudinary.config");
const { isAuthenticated } = require("./../../middleware/jwt.middleware");

// PUT - edit user profile /profile/edit/:userId
router.put('/:userId', isAuthenticated, fileUploader.single('avatar'), (req, res, next) => {
    const { name } = req.body;
    const { userId } = req.params; 
    const avatar = req.file ? req.file.path : undefined;

    User.findByIdAndUpdate( userId, { name, avatar , email  }, {new: true})
        .then((profileUpdated) => res.json(profileUpdated))
        .catch(error => res.json(error));
});

router.get("/", isAuthenticated, (req,res)=> {

    const userId = req.payload._id
    User.findById(userId)
    .then((foundUser)=> {
       // console.log("Response from User",foundUser)
        res.status(200).json({user: foundUser })
    })
    .catch((error)=> {
        console.log("Error response",error)
    })
})

// GET - to display only the products of the user
// router.get('/profile/products/', isAuthenticated, (req, res) => {
router.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
      
    Product.find({ owner: userId })
        .then((products) => {
            res.json(products);
        })
        .catch((error) => {
            res.status(500).json({ error: "Error to get products of the user." });
        });
});

// GET - to display only the bookings of the user
router.get('/user/:userId', isAuthenticated, (req, res, next) => {
    const { userId } = req.params; 

    Booking.find({ booker: userId })
        .populate('productBooked') 
        .then((bookings) => res.status(200).json(bookings))
        .catch((error) => res.status(500).json({ message: "Error to get bookings of the user", error }));
});
// GET - to display only the listings of the user




module.exports = router;