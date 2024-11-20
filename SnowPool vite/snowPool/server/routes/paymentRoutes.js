const express = require("express");
const {
  createPayment,
  getPayments,
} = require("../controllers/paymentController");

const router = express.Router();

// Routes for payments
router.post("/create", createPayment);
router.get("/", getPayments);

module.exports = router;
