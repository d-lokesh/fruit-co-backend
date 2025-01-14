const mongoose = require("mongoose");

const userVisitSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Unique user ID (anonymous)
  visitCount: { type: Number, default: 1 }, // Count of visits for this user
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  pagesVisited: [
    {
      page: { type: String, required: true }, // Page name or route
      visitDate: { type: Date, default: Date.now }, // Date of visit
    },
  ],
});

module.exports = mongoose.model("UserVisit", userVisitSchema);
