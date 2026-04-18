const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const Schedule = require("../models/Schedule");

// Predict delay for a vehicle on a route
router.get("/delay/:vehicleId", async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicleId: req.params.vehicleId });
    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });

    const today = new Date().toISOString().split("T")[0];
    const schedule = await Schedule.findOne({
      vehicleId: req.params.vehicleId,
      date: today,
    });

    // Simple heuristic prediction model
    const factors = {
      currentDelay: vehicle.delayMinutes || 0,
      speed: vehicle.speed || 0,
      occupancyRatio:
        vehicle.capacity > 0 ? vehicle.currentOccupancy / vehicle.capacity : 0,
      hour: new Date().getHours(),
    };

    // Peak hours: 8-10 AM and 5-7 PM
    const isPeakHour =
      (factors.hour >= 8 && factors.hour <= 10) ||
      (factors.hour >= 17 && factors.hour <= 19);

    let predictedDelay = factors.currentDelay;
    if (isPeakHour) predictedDelay += 5;
    if (factors.occupancyRatio > 0.85) predictedDelay += 3;
    if (factors.speed < 10 && factors.speed > 0) predictedDelay += 4;

    const confidence = Math.min(
      95,
      60 + (schedule ? 20 : 0) + (factors.currentDelay > 0 ? 10 : 0),
    );

    res.json({
      success: true,
      data: {
        vehicleId: req.params.vehicleId,
        routeNumber: vehicle.routeNumber,
        currentDelay: factors.currentDelay,
        predictedDelay: Math.max(0, predictedDelay),
        confidence: `${confidence}%`,
        factors: {
          isPeakHour,
          occupancyRatio: `${Math.round(factors.occupancyRatio * 100)}%`,
          currentSpeed: `${factors.speed} km/h`,
        },
        recommendation:
          predictedDelay > 10
            ? "Deploy additional vehicle on this route"
            : predictedDelay > 5
              ? "Monitor closely - moderate delay expected"
              : "Operating normally",
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET optimal schedule for a route
router.get("/optimal-schedule/:routeNumber", async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const schedules = await Schedule.find({
      routeNumber: req.params.routeNumber,
      date: today,
    });

    const vehicles = await Vehicle.find({
      routeNumber: req.params.routeNumber,
    });

    if (vehicles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No vehicles on this route" });
    }

    // Calculate headway (interval between vehicles)
    const avgDelay =
      schedules.reduce((sum, s) => sum + s.totalDelay, 0) /
      (schedules.length || 1);
    const activeVehicles = vehicles.filter(
      (v) => v.status === "on-route",
    ).length;
    const recommendedHeadway =
      activeVehicles > 0 ? Math.ceil(60 / activeVehicles) : 15;

    res.json({
      success: true,
      data: {
        routeNumber: req.params.routeNumber,
        totalVehicles: vehicles.length,
        activeVehicles,
        averageDelay: `${Math.round(avgDelay)} minutes`,
        recommendedHeadway: `${recommendedHeadway} minutes`,
        suggestions: [
          activeVehicles < 2
            ? "Add more vehicles during peak hours"
            : "Vehicle count adequate",
          avgDelay > 5
            ? "Consider express service to reduce delays"
            : "Schedule is performing well",
          `Optimal dispatch interval: every ${recommendedHeadway} minutes`,
        ],
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET network summary stats
router.get("/summary", async (req, res, next) => {
  try {
    const [totalVehicles, onRouteVehicles, delayedSchedules, totalRoutes] =
      await Promise.all([
        Vehicle.countDocuments(),
        Vehicle.countDocuments({ status: "on-route" }),
        Schedule.countDocuments({
          overallStatus: "delayed",
          date: new Date().toISOString().split("T")[0],
        }),
        require("../models/Route").countDocuments({ status: "active" }),
      ]);

    res.json({
      success: true,
      data: {
        totalVehicles,
        onRouteVehicles,
        idleVehicles: totalVehicles - onRouteVehicles,
        delayedTripsToday: delayedSchedules,
        activeRoutes: totalRoutes,
        networkHealth:
          delayedSchedules === 0
            ? "Good"
            : delayedSchedules < 3
              ? "Fair"
              : "Poor",
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
