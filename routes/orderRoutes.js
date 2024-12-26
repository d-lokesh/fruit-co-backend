const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware

const {
  createOrder,
  getOrderById,
  getAllOrders,
  acceptOrder,
  rejectOrder,
  deleteOrdersIfEmailEmpty,
  getOrderByQuery,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/",auth, getAllOrders);
router.patch("/:id/accept",auth, acceptOrder);
router.patch("/:id/reject",auth, rejectOrder);
router.delete('/deleteIfEmailEmpty',auth, deleteOrdersIfEmailEmpty); // Define the route
router.get('/orderData', getOrderByQuery);



module.exports = router;
