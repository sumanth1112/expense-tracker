const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const protect = require("./middleware/authMiddleware");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());              // ✅ FIX CORS ISSUE
app.use(express.json());      // Parse JSON body

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user,
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});