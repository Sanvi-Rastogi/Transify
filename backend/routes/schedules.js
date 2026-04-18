const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const { protect, schedulerOnly } = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const { routeNumber, date, vehicleId } = req.query;
    const filter = {};
    if (routeNumber) filter.routeNumber = routeNumber;
    if (date) filter.date = date;
    if (vehicleId) filter.vehicleId = vehicleId;
    const schedules = await Schedule.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: schedules.length, data: schedules });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found" });
    res.json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, schedulerOnly, async (req, res, next) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/stop", protect, schedulerOnly, async (req, res, next) => {
  try {
    const { stopName, actualTime, status } = req.body;
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found" });
    const stop = schedule.stops.find((s) => s.stopName === stopName);
    if (!stop)
      return res
        .status(404)
        .json({ success: false, message: "Stop not found in schedule" });
    stop.actualTime = actualTime;
    stop.status = status;
    const delayedStops = schedule.stops.filter((s) => s.status === "delayed");
    schedule.totalDelay = delayedStops.length * 5;
    schedule.overallStatus = schedule.totalDelay > 0 ? "delayed" : "on-time";
    await schedule.save();
    if (req.app.get("io"))
      req.app.get("io").emit("schedule-update", {
        scheduleId: schedule._id,
        routeNumber: schedule.routeNumber,
        vehicleId: schedule.vehicleId,
        overallStatus: schedule.overallStatus,
        totalDelay: schedule.totalDelay,
        updatedStop: { stopName, actualTime, status },
      });
    res.json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, schedulerOnly, async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule)
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found" });
    res.json({ success: true, message: "Schedule deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
