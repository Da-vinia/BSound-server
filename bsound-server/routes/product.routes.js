const router = require('express').Router();
const User = require("../models/User.model");
const Product = require('../models/Product.model');
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const mongoose = require('mongoose');

// GET - get all the products availables
router.get("/products", (req, res, next) => {
    Product.find()
      .populate("owner", "name") // from user
      .then((allProducts) => {
        res.json(allProducts);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error to get all the products." });
      });
  });

// GET - get the product details
router.get("/products/:productId", (req, res, next) => {
    const { productId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }
  
    Product.findById(productId)
      .populate("owner", "name")
      .then((product) => {
        // if (!product) {
        //   return res.status(404).json({ error: "Product not found." });
        // }
        res.json(product);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error to show the product." });
      });
  });

// POST - cretae a new product
router.post("/products", isAuthenticated, fileUploader.single("mediaUrl"), (req, res, next) => {

//   router.post("/products", isAuthenticated, fileUploader.array("mediaUrl", 5), (req, res, next) => {

  // const images = req.files.map((file) => file.path);

    console.log('body', req.body);


    let { productName, category, description, startDate, endDate, pricePerDay,locationCity, locationDistrict, contactDetails, mediaUrl } = req.body;
    // const owner = req.user;
    let owner = req.payload._id;
    
    mediaUrl = req.file ? req.file.path : undefined;
    // if (Array.isArray(req.files) && req.files.length > 0) {
    // const mediaUrls = req.files.map((file) => file.path);

    let newProduct = new Product({
      productName,
      category,
      description,
      availability: { 
        startDate,
        endDate
      },
      pricePerDay,
      location: {
        city: locationCity,
        district: locationDistrict
      },
      contactDetails,
      owner,
      mediaUrl
     // mediaUrl: mediaUrls
    });

  
    console.log(newProduct)
    newProduct
      .save()
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((error) => {
        console.log(error)
        res.status(400).json({ error: "Product cannot be created." });
      });

    // } else {
    //   res.status(400).json({ error: "Invalid mediaUrl. Please upload at least one file." });
    // }
  });

// PUT - edit an existing product
router.put("/products/:productId", isAuthenticated, fileUploader.single("mediaUrl"), (req, res, next) => {
    const { productId } = req.params;
    // const { productName, category, description,  availability: { 
    //   startDate,
    //   endDate,
    // } , mediaUrl, pricePerDay, location, contactDetails } = req.body;
    let { productName, category, description, startDate, endDate, pricePerDay,locationCity, locationDistrict, contactDetails, mediaUrl } = req.body;

    mediaUrl = req.file ? req.file.path : undefined;

    if(!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }
  
    Product.findByIdAndUpdate(
      productId,
      {
        productName,
        category,
        description,
        // availableDays,
        availability: { 
          startDate,
          endDate,
        },
        mediaUrl,
        pricePerDay,
        location: {
          city: locationCity,
          district: locationDistrict
        },
        contactDetails,
      },
      { new: true }
    )
      .then((updatedProduct) => {
        // if (!updatedProduct) {
        //   return res.status(404).json({ error: "Product not found." });
        // }
        res.json(updatedProduct);
      })
      .catch((error) => {
        res.status(400).json({ error: "Product cannot be updated." });
      });
  });

// DELETE 
router.delete("/products/:productId", isAuthenticated, (req, res, next) => {
    const { productId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Product.findByIdAndRemove(productId)
      .then((deletedProduct) => {
        if (!deletedProduct) {
          return res.status(404).json({ error: "Product not found." });
        }
        res.json({ message: "Product is removed successfully." });
      })
      .catch((error) => {
        res.status(400).json({ error: "Product cannot be removed." });
      });
  });
  
  
  
  
  module.exports = router;