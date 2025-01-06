const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware

const {
  healthCheck,
  dummyHealthCheck,
  createOrder,
  getOrderById,
  getSubscriptionOrders,
  getSampleOrders,
  acceptOrder,
  rejectOrder,
  deleteOrdersIfEmailEmpty,
  getOrderByQuery,
  intiWa,
  updateAddress,
  createPayment,
  markOrderDelivered
} = require("../controllers/orderController");


router.get("/health-check", healthCheck);
router.get("/dummy-health-check", dummyHealthCheck);
router.get("/initWa", intiWa);
router.post("/", createOrder);
router.get("/subscriptions",auth, getSubscriptionOrders);
router.get("/samples",auth, getSampleOrders);
router.put("/:orderId/update-address", updateAddress);
router.post("/payments/create",auth,createPayment);

router.get("/:id", getOrderById);

router.patch("/:id/accept",auth, acceptOrder);
router.patch("/:id/reject",auth, rejectOrder);
router.patch("/markOrderDelivered",auth, markOrderDelivered);

router.delete('/deleteIfEmailEmpty', deleteOrdersIfEmailEmpty); // Define the route
router.get('/orderData', getOrderByQuery);



module.exports = router;
