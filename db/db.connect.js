const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; // Make sure this matches your Vercel environment variable
    if (!uri) {
      throw new Error("MongoDB URI is missing!");
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to Database:", error);
    process.exit(1); // Stop the server if database connection fails
  }
};

module.exports = connectDB;
