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
} = require("../controllers/orderController");


router.get("/health-check", healthCheck);
router.get("/dummy-health-check", dummyHealthCheck);
router.get("/initWa", intiWa);
router.post("/", createOrder);
router.get("/subscriptions",auth, getSubscriptionOrders);
router.get("/samples",auth, getSampleOrders);
router.get("/:id", getOrderById);

router.patch("/:id/accept",auth, acceptOrder);
router.patch("/:id/reject",auth, rejectOrder);
router.delete('/deleteIfEmailEmpty', deleteOrdersIfEmailEmpty); // Define the route
router.get('/orderData', getOrderByQuery);



module.exports = router;
