const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const { initializeWhatsAppClient } = require('./utils/whatsapp/whatsappClient'); // Import the WhatsApp utility

const logger = require('./logger');  // Import the logger


dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2, process.env.ALLOWED_ORIGIN_3],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is live on port ${PORT} 🌐 🔌`);
});

// Initialize WhatsApp Client when the server starts
// WhatsApp Initialization
const userId = 'testUser';
try{
initializeWhatsAppClient(userId);
} catch (error) {
console.error('Error initializing WhatsApp client:', error);
}

console.log(process.env.EMAIL_PASS);
console.log(process.env.Email_User);
console.log(process.env.ADMIN_EMAIL);
console.log(process.env.GOOGLE_PRIVATE_KEY_ID);

console.log(process.env.ALLOWED_ORIGIN_3);

console.log(process.env.MONGO_URI);










// Serverless Handler for Vercel
module.exports = app;
