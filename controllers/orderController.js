const Order = require("../models/Order");
const { sendOrderPlacedEmail } = require("../utils/email");
const {sendOrderRejectedEmail} = require("../utils/rejectOrder_email")
const {sendOrderAcceptedEmail} = require("../utils/order_accepted_mail")
const {sendAdminNotificationEmail} = require("../utils/sendAdminNotificationEmail")
const {sendDeliveryConfirmationEmail} = require("../utils/dcMail")
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const mongoose = require('mongoose');

const logger = require('../logger');  // Import the logger



const os = require("os");



const {initializeWhatsAppClient,  } = require('../utils/whatsapp/whatsappClient'); // Import the WhatsApp utility

const {sendEnhancedWhatsAppMessage,sendQrCodeWhatsAppMessage,sendOrderConfirmationWhatsAppMessage,sendOrderRejectedWhatsAppMessage} =  require('../utils/whatsapp/whatsapp');

const { getWhatsAppClient } = require('../utils/whatsapp/whatsappClient'); // Import getClient function





const SampleOrder = require("../models/sampleOrderSchema");
const SubscriptionOrder = require("../models/subscriptionOrderSchema");
const Payment = require('../models/paymentSchema'); // Assuming Payment schema is in 'models/Payment'


let isWhatsAppInitialized = false;


exports.createOrder = async (req, res) => {
  const { name, address, phone, email, plan, deliveryDate, orderType, moreInfo } = req.body;

  try {
    let savedOrder;

    const orderId = generateOrderId(phone);

    if (orderType === "sample") {
      const newSampleOrder = new SampleOrder({
        orderId,
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
      const newSubscriptionOrder = new SubscriptionOrder({
        orderId,
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

    // Respond to the user immediately
    res.status(201).json({ message: "Order placed successfully!", data: savedOrder });

    // Run notifications in the background
    (async () => {
      try {
        await sendOrderPlacedEmail(savedOrder);
      } catch (error) {
        console.error("Error sending order placed email:", error.message);
      }

      try {
        await sendAdminNotificationEmail(savedOrder);
      } catch (error) {
        console.error("Error sending admin notification email:", error.message);
      }

      try {
        await sendEnhancedWhatsAppMessage(
          savedOrder.orderId,
          phone,
          name,
          plan,
          deliveryDate,
          orderType
        );
      } catch (error) {
        console.error("Error sending WhatsApp message:", error.message);
      }
    })();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
};

exports.markOrderDelivered = async (req, res) => {
  try {
    const { orderId, orderType } = req.body;

    if (!orderId || !orderType) {
      return res.status(400).json({ message: "Order ID and order type are required." });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Only the date part, no time


    let updatedOrder;

      if (orderType === "subscriptions") {
      // Update SubscriptionOrder
      updatedOrder = await SubscriptionOrder.findOneAndUpdate(
        { _id: orderId, "deliveredDates": { $ne: formattedDate } },
        {
          $inc: { numberOfBoxesDelivered: 1 },
          $push: { deliveredDates: currentDate },
          status: "Delivered",
        },
        { new: true }
      );
    } else if (orderType === "samples") {
      // Update SampleOrder
      updatedOrder = await SampleOrder.findOneAndUpdate(
        { _id: orderId, "deliveredDates": { $ne: formattedDate } },
        {
          $inc: { numberOfBoxesDelivered: 1 },
          $push: { deliveredDates: currentDate },
          status: "Delivered",
        },
        { new: true }
      );
    }else {
      return res.status(400).json({ message: "Invalid order type provided." });
    }

    if (!updatedOrder) {
      return res.status(400).json({ message: "Order has already been delivered today or doesn't exist." });
    }


    res.status(200).json({
      message: "Order marked as delivered.",
      order: updatedOrder,
    });

    (async () => {
      try {
        await  sendDeliveryConfirmationEmail(updatedOrder);

      } catch (error) {
        console.error("Error sending Delivery confirmation email:", error.message);
      }

    })();
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

 // Replace with any SMS provider

exports.sendQrCode = async (req, res) => {
  const { order } = req.body;

  try {
    const qrCodeUrl = './bharathQr.jpg'; // Replace with your static QR code URL

    // Send QR code via SMS
    sendQrCodeWhatsAppMessage(order.orderId,
      order.phone,
      order.name,
      order.plan,
      order.deliveryDate,
      order.orderType)

    res.status(200).json({ success: true, message: "QR code sent successfully" });
  } catch (error) {
    console.error("Error sending QR code:", error);
    res.status(500).json({ success: false, error: "Failed to send QR code" });
  }
};




exports.createPayment = async (req, res) => {
  try {
    const { orderId, orderType, paymentAmount, paymentMethod ,paymentDate,dfcOrderId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid orderId provided.' });
    }

    // Validate required fields
    if (!orderId || !orderType || !paymentAmount || !paymentMethod || !dfcOrderId) {
      return res.status(400).json({ message: 'Missing required payment details' });
    }

    dfcPaymentId = generatePaymentId(dfcOrderId)

    // Create new payment record
    const newPayment = new Payment({
      orderId,
      orderType,
      paymentAmount,
      paymentMethod,
      paymentDate,
      dfcOrderId,
      dfcPaymentId // Default status is 'Pending'
    });

    // Save the payment to the database
    const savedPayment = await newPayment.save();



    // const order = await SubscriptionOrder.findOneAndUpdate(
    //   { _id: orderId }, // Query by `_id`
    //   {
    //     $set: {
    //       paymentId: savedPayment._id,
    //       moreInfo: `payment done via ${paymentMethod}`,
    //       dfcPaymentId: dfcPaymentId
    //     }
    //   },
    //   { new: true } // To return the updated document
    // );
    
    
    // if (!order) {
    //   const order = await SampleOrder.findOneAndUpdate(
    //     { _id: orderId }, // Query by `_id`
    //     {
    //       $set: {
    //         paymentId: savedPayment._id,
    //         moreInfo: `payment done via ${paymentMethod}`,
    //         dfcPaymentId: dfcPaymentId
    //       }
    //     },
    //     { new: true } // To return the updated document
    //   );
      
    // }
    
    // if (!order) {
    //   return res.status(404).json({ message: "Order not found." });
    // }


    // Return the saved payment record
    res.status(201).json({
      message: 'Payment created successfully',
      payment: savedPayment,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};




exports.updateAddress = async (req, res) => {
  const { orderId } = req.params;
  const { address, latitude, longitude } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Address cannot be empty." });
  }

  try {
    // Check if the order exists in SampleOrder or SubscriptionOrder
    let order = await SampleOrder.findOne({ orderId });
    let modelType = "SampleOrder";

    if (!order) {
      order = await SubscriptionOrder.findOne({ orderId });
      modelType = "SubscriptionOrder";
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Update the order with the new address, latitude, and longitude
    order.newAddress = address;
    order.latitude = latitude;
    order.longitude = longitude;
    await order.save();

    return res.status(200).json({
      message: `Address updated successfully in ${modelType}.`,
      data: order,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Internal server error.", error });
  }
};




exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let filter = {};

    // Check which query parameter is passed and build the filter accordingly
    if (id) {
      if (id.length === 10) {
        // If the id is 10 digits, it's likely a phone number
        filter.phone = id;
      } else if (/^odfc/i.test(id)) {
        // If the id starts with "ODFC" (case-insensitive), it's likely an orderId
        filter.orderId = new RegExp(`^${id}`, 'i');
      } else if(id.length === 24){
        // Otherwise, assume it's an _id (Mongoose ID)
        filter._id = id;
      }
      else{
        filter.phone = id;
      }
    }

    // First, try finding the order in the SampleOrder model
    let order = await SampleOrder.findOne(filter);

    // If not found in SampleOrder, try finding it in SubscriptionOrder
    if (!order) {
      order = await SubscriptionOrder.findOne(filter);
    }

    // If not found in either, return 404
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Return the found order
    res.status(200).json(order);
  } catch (error) {
    logger.info(error);
    res.status(500).json({ error: error.message });
  }
};


exports.intiWa =  async (req, res) => {
  // if (isWhatsAppInitialized) {
  //   return res.status(400).json({ message: "WhatsApp client is already initialized." });
  // }
  try {
    await initializeWhatsAppClient();
    isWhatsAppInitialized = true;
    res.status(200).json({ message: "WhatsApp client initialized successfully." });
  } catch (err) {
    console.error("Error initializing WhatsApp client:", err);
    res.status(500).json({ message: "Error initializing WhatsApp client.", error: err.message });
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
    const { id } = req.params; // Extract the ID from the URL
    const { paymentId,paymentMethod,orderType,dfcPaymentId } = req.body; // Extract the orderType from the request body

    let order;
    logger.info("oderid and type", id, orderType);
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
    order.paymentId=paymentId;
    order.moreInfo = `payment done via ${paymentMethod}`;
    order.dfcPaymentId = dfcPaymentId;

    await order.save();

    // Send a response back to the client
    res.send({ message: "Order accepted", orderId: order._id });

    // Send an email notification

    (async () => {
      try {
        await sendOrderAcceptedEmail(order);
      } catch (error) {
        console.error("Error sending Order accepted email:", error.message);
      }

      try {
        await sendOrderConfirmationWhatsAppMessage(
          savedOrder.orderId,
          savedOrder.dfcPaymentId,
          savedOrder.phone,
          savedOrder.name,
          savedOrder.plan,
          savedOrder.deliveryDate,
          savedOrder.orderType
        );
      } catch (error) {
        console.error("Error sending WhatsApp message:", error.message);
      }
    

    })();

  } catch (error) {
    logger.info(error);
    res.status(500).json({ error: error.message });
  }
};


exports.rejectOrder = async (req, res) => {
  try {
    const { id } = req.params; // Assuming `orderType` is passed in the request
    const { reason,orderType } = req.body; // Capture rejection reason


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

   

    // Respond to the client
    res.send({ message: "Order rejected", orderId: order._id });

    // Send an email notification
    (async () => {
      try {
        await sendOrderRejectedEmail(order);
      } catch (error) {
        logger.info("Error sending rejection email:", error.message);
      }

      try {
        await sendOrderRejectedWhatsAppMessage(
          order.orderId,
          order.phone,
          order.name,
          order.plan,
          order.orderType
        );
      } catch (error) {
        console.error("Error sending WhatsApp message:", error.message);
      }

    })();


  } catch (error) {
    console.error("Error rejecting order:", error);
    res.status(500).json({ error: error.message });
  }
};



  exports.deleteOrdersIfEmailEmpty = async (req, res) => {
    try {
      // const ordersToDelete = await Order.find({ email: { $in: ['', null] } });
  
      // if (ordersToDelete.length === 0) {
      //   return res.status(404).send({ message: "No orders with empty email found" });
      // }
  
      // await Order.deleteMany({ email: { $in: ['', null] } });


      const phoneNumber = '7995830577'; // Specify the phone number to delete orders

const ordersToDelete = await SampleOrder.find({ phone: phoneNumber });

if (ordersToDelete.length === 0) {
  return res.status(404).send({ message: "No orders with the specified phone number found" });
}

await SubscriptionOrder.deleteMany({ phone: phoneNumber });
  
      res.send({ message: `${ordersToDelete.length} orders deleted because email is empty` });
    } catch (error) {
      logger.info(error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  };
  exports.getOrderByQuery = async (req, res) => {
    const { query } = req.query;
    logger.info("end");
    // Check if query parameter is provided
    if (!query) {
      return res.status(400).send({ message: 'Query parameter is required' });
    }
  
    logger.info('Received query:', query);
  
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

  const generateOrderId = (phone) => {
    const currentDate = new Date();
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Get minutes, ensure 2 digits
    const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // Get seconds, ensure 2 digits
    const lastFourDigits = phone.slice(-4); // Get the last four digits of the phone number
    
    return `ODFC${minutes}${seconds}${lastFourDigits}`; // Format orderId as ODFC-MMSS-XXXX
};

const generatePaymentId = (dfcOrderId) => {
  const currentDate = new Date();
  const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Get minutes, ensure 2 digits
  const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // Get seconds, ensure 2 digits
  const lastFourDigits = dfcOrderId.slice(-4); // Get the last four digits of the phone number
  
  return `TRODFC${minutes}${seconds}${lastFourDigits}`; // Format orderId as ODFC-MMSS-XXXX
};




exports.healthCheck = async (req, res) => {
  try {

    senddummymessage()
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

    const metrics = {
      status: 'Healthy',
      uptime: process.uptime(),
      dbConnection: 'Connected',
      sampleOrderCount,
      subscriptionOrderCount,
      systemMetrics: {
        memoryUsage: {
          rss: `${bytesToMB(memoryUsage.rss)} MB`,
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
    };

    // Log the metrics to the console
    logger.info("--------- Hourly Service Metrics ---------");
    logger.info(JSON.stringify(metrics, null, 2)); // Prettify the JSON log

    // Send the metrics as JSON response
    res.status(200).json(metrics);

  } catch (error) {
    // Log the error with timestamp
    logger.error("Unhealthy: " + error.message);

    // Send error response
    res.status(500).json({
      status: 'Unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};


exports.dummyHealthCheck = async (req,res) =>{

  console.info("-----------Service is Healthy-----------")

  res.status(200).json({ message: "health chech was successfully!", data: "successfull" });

}
  
const senddummymessage = async () => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = "7995830577".startsWith('91') ? `${7995830577}@c.us` : `91${7995830577}@c.us`;

  const whatsappMessage = `test message`;

  try {
    const media = MessageMedia.fromFilePath('./dfc.png'); // Path to your image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('whatsapp message with Image sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};
