const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error(
      "Missing MONGO_URI environment variable. Set it in Render or use a local .env file for development."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;