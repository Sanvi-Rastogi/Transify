const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Route = require("../models/Route");
const { protect } = require("../middleware/auth");

// Fare calculation helper
const calcFare = (stops, fromStop, toStop, type) => {
  const fromIdx = stops.findIndex((s) => s.name === fromStop);
  const toIdx = stops.findIndex((s) => s.name === toStop);
  const stopsDiff = Math.abs(toIdx - fromIdx);
  const base = type === "train" ? 15 : 10;
  return base + stopsDiff * (type === "train" ? 8 : 5);
};

// GET my bookings
router.get("/my", protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

// GET all bookings (scheduler)
router.get(
  "/",
  protect,
  require("../middleware/auth").schedulerOnly,
  async (req, res, next) => {
    try {
      const bookings = await Booking.find()
        .sort({ createdAt: -1 })
        .populate("userId", "name email");
      res.json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
      next(err);
    }
  },
);

// POST book a ticket
router.post("/", protect, async (req, res, next) => {
  try {
    const { routeNumber, vehicleId, fromStop, toStop, travelDate } = req.body;

    const route = await Route.findOne({ routeNumber });
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });

    const vehicle = await Vehicle.findOne({ vehicleId });
    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    // Check capacity
    const existingBookings = await Booking.countDocuments({
      vehicleId,
      travelDate,
      status: "confirmed",
    });
    if (existingBookings >= vehicle.capacity)
      return res
        .status(400)
        .json({ success: false, message: "Vehicle is fully booked" });

    const seatNumber = existingBookings + 1;
    const fare = calcFare(route.stops, fromStop, toStop, vehicle.type);

    const booking = await Booking.create({
      userId: req.user._id,
      userName: req.user.name,
      routeNumber,
      routeName: route.name,
      vehicleId,
      vehicleType: vehicle.type,
      fromStop,
      toStop,
      travelDate,
      seatNumber,
      fare,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// PATCH cancel booking
router.patch("/:id/cancel", protect, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    booking.status = "cancelled";
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
