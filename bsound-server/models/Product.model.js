const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      min: 3,
      max: 50,
    },
    category: {
      type: String,
      required: [true, 'A category is required.'],
      enum: ['speakers', 'microphones', 'turntables', 'audio cables', 'instruments', 'lighting'],
    },
    description: {
      type: String,
      min: 10,
      max: 100,
    },
    availableDays: {
      type: [Date],
      default: [],
      required: true,
    },
    mediaUrl:[ 
        {
            type: String,
        },
    ],
    pricePerDay: {
        type: Number,
        required: [true, 'Price per day is required.'],
    },
    location: {
        city: {
            type: String,
            default: 'Berlin',
        },
        district: {
            type: String,
            required: [true, 'A district is required.'],
            enum: [
                'Mitte',
                'Friedrichshain-Kreuzberg',
                'Pankow',
                'Charlottenburg-Wilmersdorf',
                'Spandau',
                'Steglitz-Zehlendorf',
                'Tempelhof-Schöneberg',
                'Neukölln',
                'Treptow-Köpenick',
                'Marzahn-Hellersdorf',
                'Lichtenberg',
                'Reinickendorf',
            ],
        },
    },
    contactDetails: {
        type: String,
        required: [true, 'Email is required.'],
        select: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Product = model("Product", productSchema);

module.exports = Product;