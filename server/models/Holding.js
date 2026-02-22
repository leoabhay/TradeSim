const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  averagePrice: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Holding", holdingSchema);