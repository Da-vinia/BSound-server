const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const categoryIcons = {
    parties: './parties-icon.png',
    djs: './djs-icon.png',
    venues: './venues-icon.png',
    recordingStudios: './recording-studios-icon.png',
    classes: './classes-icon.png'
}

const listingsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      min: 3,
      max: 50,
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      min: 10,
      max: 100,
    },
    media: [
        {
        type: String,
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        required: [true, 'A category is required.'],
        enum: Object.keys(categoryIcons),
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
},
{
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Listings = model("Listings", listingsSchema);

module.exports = Listings;
