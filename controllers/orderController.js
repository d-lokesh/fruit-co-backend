const Order = require("../models/Order");
const { sendOrderPlacedEmail } = require("../utils/email");


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
  
      res.send({ message: "Order rejected", orderId: order._id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
