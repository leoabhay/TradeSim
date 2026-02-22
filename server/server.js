const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

// Required Environment Variables
const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`ERROR: Missing required environment variable: ${env}`);
    process.exit(1);
  }
});

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("combined")); // Better logging for production
app.use("/api/", limiter); // Apply rate limiting to API routes

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/stocks", require("./routes/stocks"));
app.use("/api/trades", require("./routes/trades"));
app.use("/api/user", require("./routes/user"));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Serve Static Assets in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("(.*)", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "An internal server error occurred",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
