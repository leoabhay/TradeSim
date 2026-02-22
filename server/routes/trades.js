const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Trade = require("../models/Trade");
const User = require("../models/User");
const Holding = require("../models/Holding");

// Place a trade (BUY/SELL)
router.post("/place", auth, async (req, res) => {
  try {
    const { symbol, type, quantity, price } = req.body;
    const userId = req.user.id;
    const totalAmount = quantity * price;

    const user = await User.findById(userId);

    if (type === "BUY") {
      if (user.balance < totalAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Update balance
      user.balance -= totalAmount;
      await user.save();

      // Update/Create holding
      let holding = await Holding.findOne({ userId, symbol });
      if (holding) {
        const newTotalQuantity = holding.quantity + quantity;
        const newAveragePrice =
          (holding.quantity * holding.averagePrice + totalAmount) /
          newTotalQuantity;
        holding.quantity = newTotalQuantity;
        holding.averagePrice = newAveragePrice;
        await holding.save();
      } else {
        holding = new Holding({
          userId,
          symbol,
          quantity,
          averagePrice: price,
        });
        await holding.save();
      }
    } else if (type === "SELL") {
      const holding = await Holding.findOne({ userId, symbol });
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient holdings" });
      }

      // Update balance
      user.balance += totalAmount;
      await user.save();

      // Update holding
      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        await Holding.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }
    }

    // Record trade
    const trade = new Trade({
      userId,
      symbol,
      type,
      quantity,
      price,
      totalAmount,
    });
    await trade.save();

    res.json({ message: "Trade successful", balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get trade history
router.get("/history", auth, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.id }).sort({
      timestamp: -1,
    });
    res.json(trades);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;