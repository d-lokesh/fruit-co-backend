const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [process.env.ALLOWED_ORIGIN_1, process.env.ALLOWED_ORIGIN_2],
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
  console.log(`Server running on port ${PORT}`);
});

// Serverless Handler for Vercel
module.exports = app;
