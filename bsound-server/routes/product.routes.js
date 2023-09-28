const router = require('express').Router();
const User = require("../models/User.model");
const Product = require('../models/Product.model');
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET - get all the products availables
router.get("/", (req, res) => {
    Product.find()
      .populate("owner", "name")
      .then((products) => {
        res.json(products);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error to get all the products." });
      });
  });

// GET - get the product details
router.get("/:productId", (req, res) => {
    const { productId } = req.params;
  
    Product.findById(productId)
      .populate("owner", "name")
      .then((product) => {
        if (!product) {
          return res.status(404).json({ error: "Product not found." });
        }
        res.json(product);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error to show the product." });
      });
  });

// POST - cretae a new product
router.post("/", isAuthenticated, fileUploader.array("mediaUrl", 5), (req, res) => {
    const { productName, category, description, availableDays, mediaUrl, pricePerDay, location, contactDetails } = req.body;
    const owner = req.user.id;
    const mediaUrls = req.files.map((file) => file.path);
  
    const newProduct = new Product({
      productName,
      category,
      description,
      availableDays,
      mediaUrl: mediaUrls,
      pricePerDay,
      location,
      contactDetails,
      owner,
    });
  
    newProduct
      .save()
      .then((product) => {
        res.status(201).json(product);
      })
      .catch((error) => {
        res.status(400).json({ error: "Product cannot be created." });
      });
  });

// PUT - edit an existing product
router.put("/:productId", isAuthenticated, fileUploader.array("mediaUrl", 5), (req, res) => {
    const { productId } = req.params;
    const { productName, category, description, availableDays, mediaUrl, pricePerDay, location, contactDetails } = req.body;
    const mediaUrls = req.files.map((file) => file.path); 
  
    Product.findByIdAndUpdate(
      productId,
      {
        productName,
        category,
        description,
        availableDays,
        mediaUrl: mediaUrls,
        pricePerDay,
        location,
        contactDetails,
      },
      { new: true }
    )
      .then((updatedProduct) => {
        if (!updatedProduct) {
          return res.status(404).json({ error: "Product not found." });
        }
        res.json(updatedProduct);
      })
      .catch((error) => {
        res.status(400).json({ error: "Product cannot be updated." });
      });
  });

// DELETE 
router.delete("/:productId", isAuthenticated, (req, res) => {
    const { productId } = req.params;
  
    Product.findByIdAndRemove(productId)
      .then((deletedProduct) => {
        if (!deletedProduct) {
          return res.status(404).json({ error: "Product not found." });
        }
        res.json({ message: "Product removed successfully." });
      })
      .catch((error) => {
        res.status(400).json({ error: "Product cannot be removed." });
      });
  });
  
  module.exports = router;