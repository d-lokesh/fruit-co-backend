const mongoose = require("mongoose");

const logger = require('../logger');  // Import the logger


const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://fruitco:Fruitco504@cluster0.vhecl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    logger.info(`Your database is up and ready to go! connected to ${conn.connection.host} 💾 ✅ `);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
