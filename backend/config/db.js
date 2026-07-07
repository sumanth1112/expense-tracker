const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expense-tracker";

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error(error.message);

    if (
      process.env.MONGO_URI &&
      (error.code === "ENOTFOUND" ||
        error.message.includes("querySrv ENOTFOUND") ||
        error.message.includes("getaddrinfo ENOTFOUND"))
    ) {
      const fallbackURI = "mongodb://127.0.0.1:27017/expense-tracker";
      console.warn(
        `Falling back to local MongoDB at ${fallbackURI} because Atlas DNS failed.`
      );
      try {
        await mongoose.connect(fallbackURI);
        console.log("MongoDB Connected to local instance ✅");
        return;
      } catch (localError) {
        console.error(localError.message);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;