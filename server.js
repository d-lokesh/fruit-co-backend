const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const {initializeWhatsAppClient } = require('./utils/whatsapp/whatsapp'); // Import the WhatsApp utility

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2,process.env.ALLOWED_ORIGIN_3],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);


// Initialize WhatsApp Client when the server starts
initializeWhatsAppClient()
  .then(() => {
    console.log('WhatsApp client initialized and ready!');
  })
  .catch((err) => {
    console.error('Error initializing WhatsApp client:', err);
  });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});

// Serverless Handler for Vercel
module.exports = app;
