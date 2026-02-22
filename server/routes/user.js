const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Holding = require("../models/Holding");

// Get user info and portfolio
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const holdings = await Holding.find({ userId: req.user.id });
    res.json({ user, holdings });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;