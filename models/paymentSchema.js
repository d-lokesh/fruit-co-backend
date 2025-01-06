const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    }, // Foreign key for either SampleOrder or SubscriptionOrder
    orderType: { 
      type: String, 
      required: true 
    }, // Determines if the payment is linked to a SampleOrder or SubscriptionOrder
    paymentDate: { 
      type: Date, 
      required: true, 
      default: Date.now 
    },
    paymentAmount: { 
      type: Number, 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      required: true 
    }, // Example: 'Credit Card', 'Cash', 'Online'
    paymentStatus: { 
      type: String, 
      default: "Pending", 
      enum: ["Pending", "Completed", "Failed"] 
    },
    razorpayPaymentId: { 
      type: String, 
      // Optional: to store Razorpay-specific payment ID later
    },
    razorpayOrderId: { 
      type: String, 
      // Optional: to store Razorpay order ID later
    },
    transactionId: { 
      type: String 
    }, // Transaction ID for the payment
    moreInfo: { 
      type: String 
    }, // Any additional information related to the payment
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Payment", paymentSchema);
