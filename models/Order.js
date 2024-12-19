const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  plan: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  status: { type: String, default: "Pending" },
  moreInfo: { type: String, required: false }  
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
