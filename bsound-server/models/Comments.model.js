const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const commentsSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    listingId: {
        type: Schema.Types.ObjectId,
        ref: "Listings",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Comments = model("Comments", commentsSchema);

module.exports = Comments;
