const router = require('express').Router();
const User = require("../../models/User.model");
const Product = require('../../models/Product.model');
const Booking = require("../../models/Booking.model");
const Listings = require("../../models/Listings.model");
const fileUploader = require("../../config/cloudinary.config");
const { isAuthenticated } = require("./../../middleware/jwt.middleware");

// PUT - edit user profile /profile/edit/:userId
router.put('/', isAuthenticated, fileUploader.single('avatar'), (req, res, next) => {
    let { name , email , avatar} = req.body;
    const request = res.req;

    const user = request.payload;

    const userId = user._id;

    console.log(userId);
     
    avatar = req.file ? req.file.path : undefined;

    User.findByIdAndUpdate( userId, { name, avatar , email  }, {new: true})
        .then((profileUpdated) => res.json(profileUpdated))
        .catch(error => res.json(error));
});


// this is the get route withe the list of products and list of bookings and listins that I'll create later and see on the user profile
// router.get("/", isAuthenticated, (req,res)=> {

//     const userId = req.payload._id
//     User.findById(userId)
//     .then((foundUser)=> {
//        // console.log("Response from User",foundUser)
//        Product.find().then((foundProducts) => res.json({user:foundUser, product:foundProduct, listing:foun}))
//         res.status(200).json({user: foundUser })

//         Booking.find({ booker: userId })
//         .populate('productBooked') 
//         .then((bookings) => res.status(200).json(bookings))
//     })
//     .catch((error)=> {
//         console.log("Error response",error)
//     })
// })


router.get("/", isAuthenticated, (req,res)=> {
    const userId = req.payload._id
    User.findById(userId)
    .then((foundUser)=> {
        res.status(200).json({user: foundUser })
    })
    .catch((error)=> {
        console.log("Error response",error)
    })
})

// GET - to display only the products of the user
// router.get('/profile/products/', isAuthenticated, (req, res) => {
// router.get("/user/:userId", (req, res) => {
//     const userId = req.params.userId;
      
//     Product.find({ owner: userId })
//         .then((products) => {
//             res.json(products);
//         })
//         .catch((error) => {
//             res.status(500).json({ error: "Error to get products of the user." });
//         });
// });

// GET - to display only the bookings of the user
// router.get('/user/:userId', isAuthenticated, (req, res, next) => {
//     const { userId } = req.params; 

//     Booking.find({ booker: userId })
//         .populate('productBooked') 
//         .then((bookings) => res.status(200).json(bookings))
//         .catch((error) => res.status(500).json({ message: "Error to get bookings of the user", error }));
// });
// GET - to display only the listings of the user




module.exports = router;