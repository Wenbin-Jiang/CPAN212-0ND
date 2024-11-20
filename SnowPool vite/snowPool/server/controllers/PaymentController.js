const Payment = require("../models/paymentModal");

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { booking, amount, method } = req.body;

    const newPayment = new Payment({ booking, amount, method });
    const savedPayment = await newPayment.save();

    res.status(201).json({ success: true, payment: savedPayment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get All Payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate(
      "booking",
      "trip amount status"
    );
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
