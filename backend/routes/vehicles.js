const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const { protect, schedulerOnly } = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const { type, status, routeNumber } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (routeNumber) filter.routeNumber = routeNumber;
    const vehicles = await Vehicle.find(filter);
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err) {
    next(err);
  }
});

router.get("/:vehicleId", async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicleId: req.params.vehicleId });
    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, schedulerOnly, async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:vehicleId/location",
  protect,
  schedulerOnly,
  async (req, res, next) => {
    try {
      const { lat, lng, speed, currentStop, nextStop, status } = req.body;
      const vehicle = await Vehicle.findOneAndUpdate(
        { vehicleId: req.params.vehicleId },
        {
          location: { lat, lng, lastUpdated: new Date() },
          speed,
          currentStop,
          nextStop,
          status,
        },
        { new: true },
      );
      if (!vehicle)
        return res
          .status(404)
          .json({ success: false, message: "Vehicle not found" });
      if (req.app.get("io"))
        req.app.get("io").emit("vehicle-location-update", {
          vehicleId: vehicle.vehicleId,
          location: vehicle.location,
          speed: vehicle.speed,
          status: vehicle.status,
          currentStop: vehicle.currentStop,
          nextStop: vehicle.nextStop,
        });
      res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/:vehicleId/occupancy",
  protect,
  schedulerOnly,
  async (req, res, next) => {
    try {
      const { currentOccupancy } = req.body;
      const vehicle = await Vehicle.findOneAndUpdate(
        { vehicleId: req.params.vehicleId },
        { currentOccupancy },
        { new: true },
      );
      if (!vehicle)
        return res
          .status(404)
          .json({ success: false, message: "Vehicle not found" });
      if (req.app.get("io"))
        req.app.get("io").emit("occupancy-update", {
          vehicleId: vehicle.vehicleId,
          currentOccupancy: vehicle.currentOccupancy,
          capacity: vehicle.capacity,
          percentage: Math.round(
            (vehicle.currentOccupancy / vehicle.capacity) * 100,
          ),
        });
      res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:vehicleId", protect, schedulerOnly, async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      vehicleId: req.params.vehicleId,
    });
    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    res.json({ success: true, message: "Vehicle deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
