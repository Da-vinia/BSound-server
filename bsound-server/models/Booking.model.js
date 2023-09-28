const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const bookingSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: [true, 'Start date is required.'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required.'],
    },
    totalPrice: {
      type: Number,
      required: true, 
    },
    booker: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productBooked: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
