const mongoose = require("mongoose");

const sampleOrderSchema = new mongoose.Schema(
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
    orderType: { type: String, default: "sample", required: true },
    deliveredDates: { type: [Date], default: [] },
    numberOfBoxesDelivered: { type: Number, default: 0 },
    latitude: { type: Number }, // Latitude of new address
    longitude: { type: Number }, // Longitude of new address
  },
  { timestamps: true }
);

module.exports = mongoose.model("SampleOrder", sampleOrderSchema);
