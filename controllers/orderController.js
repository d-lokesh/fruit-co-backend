const Order = require("../models/Order");
const { sendOrderPlacedEmail } = require("../utils/email");
const {sendOrderRejectedEmail} = require("../utils/rejectOrder_email")
const {sendOrderAcceptedEmail} = require("../utils/order_accepted_mail")



exports.createOrder = async (req, res) => {
  const { name, address, phone, email, plan, deliveryDate } = req.body;

  try {
    const newOrder = new Order({ name, address, phone, email, plan, deliveryDate });
    const savedOrder = await newOrder.save();

    await sendOrderPlacedEmail(savedOrder);

    res.status(201).json({ message: "Order placed successfully!", orderId: savedOrder._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send({ message: "Order not found" });

    order.status = "Accepted";
    await order.save();
    res.send({ message: "Order accepted", orderId: order._id });
    await sendOrderAcceptedEmail(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.rejectOrder = async (req, res) => {
    try {
      const { reason } = req.body;  // Capture rejection reason
  
      // Find the order by ID
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).send({ message: "Order not found" });
  
      // Set the order status to "Rejected"
      order.status = "Rejected";
  
      // Save the rejection reason in the moreInfo field
      order.moreInfo = reason;  // Store rejection reason in moreInfo
  
      await order.save();  // Save the updated order

      await sendOrderRejectedEmail(order);
  
      res.send({ message: "Order rejected", orderId: order._id });
    } catch (error) {
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
  
  
