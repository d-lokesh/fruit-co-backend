const mongoose = require("mongoose");

const subscriptionOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // Order ID for tracking

    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, required: true }, // Subscription Plan
    deliveryDate: { type: Date, required: true },
    status: { type: String, default: "Pending" },
    moreInfo: { type: String },
    orderType: { type: String, default: "monthly", required: true }, // Order Type
    deliveredDates: { type: [Date], default: [] }, // Array of successful delivery dates
    numberOfBoxesDelivered: { type: Number, default: 0 }, // Number of boxes successfully delivered
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionOrder", subscriptionOrderSchema);
