const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware

const {
  healthCheck,
  createOrder,
  getOrderById,
  getSubscriptionOrders,
  getSampleOrders,
  acceptOrder,
  rejectOrder,
  deleteOrdersIfEmailEmpty,
  getOrderByQuery,
  intiWa,
} = require("../controllers/orderController");


router.get("/health-check", healthCheck);
router.post("/initWa", intiWa);
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/subsciprtions",auth, getSubscriptionOrders);
router.get("/samples",auth, getSampleOrders);
router.patch("/:id/accept",auth, acceptOrder);
router.patch("/:id/reject",auth, rejectOrder);
router.delete('/deleteIfEmailEmpty',auth, deleteOrdersIfEmailEmpty); // Define the route
router.get('/orderData', getOrderByQuery);



module.exports = router;
