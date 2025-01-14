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
  markOrderDelivered,
  sendQrCode
} = require("../controllers/orderController");

const {UserVisitfn,ButtonClickfn} = require("../controllers/siteAnalytics");


router.get("/health-check", healthCheck);
router.get("/dummy-health-check", dummyHealthCheck);
router.get("/initWa",auth, intiWa);
router.post("/", createOrder);
router.get("/subscriptions",auth, getSubscriptionOrders);
router.get("/samples",auth, getSampleOrders);
router.put("/:orderId/update-address", updateAddress);
router.post("/payments/create",auth,createPayment);
router.post("/payments/sendqrcode",auth, sendQrCode);

router.get("/:id", getOrderById);

router.patch("/:id/accept",auth, acceptOrder);
router.patch("/:id/reject",auth, rejectOrder);
router.patch("/markOrderDelivered",auth, markOrderDelivered);

router.delete('/deleteIfEmailEmpty',auth, deleteOrdersIfEmailEmpty); // Define the route
router.get('/orderData', getOrderByQuery);
router.post("/track-visit", UserVisitfn);
router.post("/track-button-click", ButtonClickfn);





module.exports = router;
