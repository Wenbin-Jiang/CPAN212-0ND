const express = require("express");
const router = express.Router();
const {
  createPayment,
  confirmPayment,
  getPaymentsByUser,
} = require("../controllers/paymentController");
const protectAndAuthorize = require("../middleware/authMiddleware");

// All routes are protected
router.post("/", protectAndAuthorize, createPayment);
router.put("/:paymentId/confirm", protectAndAuthorize, confirmPayment);
router.get("/user/payments", protectAndAuthorize, getPaymentsByUser);

module.exports = router;
