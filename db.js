const mongoose = require('mongoose');
require("dotenv").config(); // ✅ Load environment variables

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("✅ Already connected to MongoDB.");
            return;
        }

        // ✅ Ensure MONGO_URI is correctly loaded
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is not defined in .env file");
        }

        // ✅ Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // ⏳ Wait 10 seconds before failing
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
