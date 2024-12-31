const Order = require("../models/Order");
const { sendOrderPlacedEmail } = require("../utils/email");
const {sendOrderRejectedEmail} = require("../utils/rejectOrder_email")
const {sendOrderAcceptedEmail} = require("../utils/order_accepted_mail")
const {sendAdminNotificationEmail} = require("../utils/sendAdminNotificationEmail")

const os = require("os");



const {initializeWhatsAppClient, sendEnhancedWhatsAppMessage } = require('../utils/whatsapp/whatsapp'); // Import the WhatsApp utility





const SampleOrder = require("../models/sampleOrderSchema");
const SubscriptionOrder = require("../models/subscriptionOrderSchema");




exports.healthCheck = async (req, res) => {
  try {
    // Check database connection status
    const sampleOrderCount = await SampleOrder.countDocuments().exec();
    const subscriptionOrderCount = await SubscriptionOrder.countDocuments().exec();

    // Get system metrics
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const cpuLoad = os.loadavg(); // [1-minute, 5-minute, 15-minute load average]

    // Convert bytes to megabytes (MB)
    const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
    console.info("Healthy");
    res.status(200).json({
      status: "Healthy",
      uptime: process.uptime(),
      dbConnection: "Connected",
      sampleOrderCount,
      subscriptionOrderCount,
      systemMetrics: {
        memoryUsage: {
          rss: `${bytesToMB(memoryUsage.rss)} MB`, // Resident Set Size
          heapTotal: `${bytesToMB(memoryUsage.heapTotal)} MB`,
          heapUsed: `${bytesToMB(memoryUsage.heapUsed)} MB`,
          external: `${bytesToMB(memoryUsage.external)} MB`,
          arrayBuffers: `${bytesToMB(memoryUsage.arrayBuffers)} MB`,
        },
        memory: {
          total: `${bytesToMB(totalMemory)} MB`,
          free: `${bytesToMB(freeMemory)} MB`,
          used: `${bytesToMB(usedMemory)} MB`,
        },
        cpuLoad: {
          "1m": cpuLoad[0],
          "5m": cpuLoad[1],
          "15m": cpuLoad[2],
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unhealthy");
    res.status(500).json({
      status: "Unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};



exports.createOrder = async (req, res) => {
  const { name, address, phone, email, plan, deliveryDate, orderType, moreInfo } = req.body;

  try {
    let savedOrder;

    if (orderType === "sample") {
      // Save to SampleOrder collection
      const newSampleOrder = new SampleOrder({
        name,
        address,
        phone,
        email,
        plan,
        deliveryDate,
        orderType,
        moreInfo,
      });
      savedOrder = await newSampleOrder.save();
    } else if (orderType === "subscription") {
      // Save to SubscriptionOrder collection
      const newSubscriptionOrder = new SubscriptionOrder({
        name,
        address,
        phone,
        email,
        plan,
        deliveryDate,
        orderType,
        moreInfo,
      });
      savedOrder = await newSubscriptionOrder.save();
    } else {
      return res.status(400).json({ message: "Invalid order type" });
    }

    // Send notifications
    await sendOrderPlacedEmail(savedOrder);
    await sendAdminNotificationEmail(savedOrder);

    try {

      await sendEnhancedWhatsAppMessage(
        phone,
        name,
        plan,
        deliveryDate,
        orderType,
        moreInfo      );
    } catch (error) {
      console.error('Error:', error.message);
    }
 

    res.status(201).json({ message: "Order placed successfully!", data: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // First, try finding the order in the SampleOrder model
    let order = await SampleOrder.findById(id);

    // If not found in SampleOrder, try finding it in SubscriptionOrder
    if (!order) {
      order = await SubscriptionOrder.findById(id);
    }

    // If not found in either, return 404
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Return the found order
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getSubscriptionOrders = async (req, res) => {
  try {
    const orders = await SubscriptionOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

exports.getSampleOrders = async (req, res) => {
  try {
    const orders = await SampleOrder.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { id, orderType } = req.params; // Assuming `orderType` is passed in the request

    let order;

    // Determine which model to query based on `orderType`
    if (orderType === "sample") {
      order = await SampleOrder.findById(id);
    } else if (orderType === "subscription") {
      order = await SubscriptionOrder.findById(id);
    } else {
      return res.status(400).send({ message: "Invalid order type" });
    }

    // Handle case where the order is not found
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Update order status to "Accepted"
    order.status = "Accepted";
    await order.save();

    // Send a response back to the client
    res.send({ message: "Order accepted", orderId: order._id });

    // Send an email notification
    await sendOrderAcceptedEmail(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


exports.rejectOrder = async (req, res) => {
  try {
    const { id, orderType } = req.params; // Assuming `orderType` is passed in the request
    const { reason } = req.body; // Capture rejection reason

    let order;

    // Determine which model to query based on `orderType`
    if (orderType === "sample") {
      order = await SampleOrder.findById(id);
    } else if (orderType === "subscription") {
      order = await SubscriptionOrder.findById(id);
    } else {
      return res.status(400).send({ message: "Invalid order type" });
    }

    // Handle case where the order is not found
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Set the order status to "Rejected" and store the rejection reason
    order.status = "Rejected";
    order.moreInfo = reason; // Save the rejection reason in the `moreInfo` field

    // Save the updated order
    await order.save();

    // Send an email notification
    try {
      await sendOrderRejectedEmail(order);
    } catch (emailError) {
      console.log("Error sending rejection email:", emailError);
    }

    // Respond to the client
    res.send({ message: "Order rejected", orderId: order._id });
  } catch (error) {
    console.error("Error rejecting order:", error);
    res.status(500).json({ error: error.message });
  }
};



  exports.deleteOrdersIfEmailEmpty = async (req, res) => {
    try {
      const ordersToDelete = await Order.find({ email: { $in: ['', null] } });
  
      if (ordersToDelete.length === 0) {
        return res.status(404).send({ message: "No orders with empty email found" });
      }
  
      await Order.deleteMany({ email: { $in: ['', null] } });
  
      res.send({ message: `${ordersToDelete.length} orders deleted because email is empty` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  };
  exports.getOrderByQuery = async (req, res) => {
    console.log("started");
    const { query } = req.query;
    console.log("end");
    // Check if query parameter is provided
    if (!query) {
      return res.status(400).send({ message: 'Query parameter is required' });
    }
  
    console.log('Received query:', query);
  
    try {
      // Check if query is a valid ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(query);
  
      // Build the search criteria based on the query type
      let searchCriteria = {};
      
      // If query is a valid ObjectId, search by _id
      if (isValidObjectId) {
        searchCriteria._id = query;
      } else {
        // Otherwise, search by phone number
        searchCriteria.phone = query;
      }
  
      // Find the order using the appropriate search criteria
      const order = await Order.findOne(searchCriteria);
  
      // If no order found, return 404
      if (!order) {
        return res.status(404).send({ message: 'Order not found' });
      }
  
      // Return the found order
      res.send(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  };
  
