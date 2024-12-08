const Payment = require("../models/paymentModal");
const Booking = require("../models/bookingModal");
const User = require("../models/userModel");

const createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const payment = new Payment({
      booking: bookingId,
      amount: booking.totalAmount,
      paymentMethod,
      status: "pending",
    });

    await payment.save();

    booking.paymentStatus = "pending";
    await booking.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { transactionId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "completed";
    payment.transactionId = transactionId;
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    booking.paymentStatus = "paid";
    await booking.save();

    const recipient = await User.findById(booking.driver);
    recipient.notifications.push({
      type: "paymentReceived",
      booking: booking._id,
      message: `Payment received for booking #${booking._id}`,
    });
    await recipient.save();

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user.id });
    const payments = await Payment.find({
      booking: { $in: bookings.map((b) => b._id) },
    }).populate("booking");

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  confirmPayment,
  getPaymentsByUser,
};
