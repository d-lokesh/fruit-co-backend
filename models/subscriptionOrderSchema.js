const mongoose = require("mongoose");

const subscriptionOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    newAddress: { type: String }, // New address for updates
    phone: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    status: { type: String, default: "Pending" },
    moreInfo: { type: String },
    orderType: { type: String, default: "monthly", required: true },
    deliveredDates: { type: [Date], default: [] },
    numberOfBoxesDelivered: { type: Number, default: 0 },
    latitude: { type: Number }, // Latitude of new address
    longitude: { type: Number }, // Longitude of new address
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }, // Reference to Payment schema
    dfcPaymentId:{
      type: String, 
  }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionOrder", subscriptionOrderSchema);
