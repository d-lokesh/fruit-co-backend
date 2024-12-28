const mongoose = require("mongoose");

const subscriptionOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, required: true }, // Subscription Plan
    deliveryDate: { type: Date, required: true },
    status: { type: String, default: "Pending" },
    moreInfo: { type: String },
    orderType: { type: String, default: "monthly", required: true }, // Order Type
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionOrder", subscriptionOrderSchema);
