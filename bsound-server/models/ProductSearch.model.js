const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');


const productSearchSchema = new Schema({
  productName: {
    type: String,
    default: "", // Valor por defecto para productName
  },
  category: {
    type: String,
    default: "", // Valor por defecto para category
  },
  // Agrega otros campos opcionales que deseas buscar aquí
}, { strict: false });


const ProductSearch = model("ProductSearch", productSearchSchema);

module.exports = productSearchSchema;