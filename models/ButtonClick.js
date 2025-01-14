const mongoose = require("mongoose");

const buttonClickSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true }, // e.g., "View Details", "Subscribe", "Order Sample"
  packageName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ButtonClick", buttonClickSchema);
