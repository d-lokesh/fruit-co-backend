const mongoose = require("mongoose");

const sampleOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, required: true }, // Sample Box Plan
    deliveryDate: { type: Date, required: true },
    status: { type: String, default: "Pending" },
    moreInfo: { type: String },
    orderType: { type: String, default: "sample", required: true }, // Order Type
  },
  { timestamps: true }
);

module.exports = mongoose.model("SampleOrder", sampleOrderSchema);
