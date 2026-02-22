const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  sector: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("Stock", stockSchema);