const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware

const {
  createOrder,
  getOrderById,
  getAllOrders,
  acceptOrder,
  rejectOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/", getAllOrders);
router.patch("/:id/accept", acceptOrder);
router.patch("/:id/reject", rejectOrder);

module.exports = router;
