const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock");

// Get all stocks with simulated real-time prices
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find();

    // Add randomness to simulate live market price updates
    const updatedStocks = stocks.map((s) => {
      // Use basePrice as the anchor
      const priceChange = (Math.random() - 0.5) * (s.basePrice * 0.02); // 2% max swing
      const price = +(s.basePrice + priceChange).toFixed(2);
      const changePercent = +((priceChange / s.basePrice) * 100).toFixed(2);

      return {
        symbol: s.symbol,
        name: s.name,
        price: price,
        change: changePercent,
        sector: s.sector,
      };
    });

    res.json(updatedStocks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;