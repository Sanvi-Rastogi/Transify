const express = require("express");
const router = express.Router();
const Route = require("../models/Route");
const { protect, schedulerOnly } = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    const routes = await Route.find(filter);
    res.json({ success: true, count: routes.length, data: routes });
  } catch (err) {
    next(err);
  }
});

router.get("/:routeNumber", async (req, res, next) => {
  try {
    const route = await Route.findOne({ routeNumber: req.params.routeNumber });
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    res.json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, schedulerOnly, async (req, res, next) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
});

router.put("/:routeNumber", protect, schedulerOnly, async (req, res, next) => {
  try {
    const route = await Route.findOneAndUpdate(
      { routeNumber: req.params.routeNumber },
      req.body,
      { new: true, runValidators: true },
    );
    if (!route)
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    res.json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/:routeNumber",
  protect,
  schedulerOnly,
  async (req, res, next) => {
    try {
      const route = await Route.findOneAndDelete({
        routeNumber: req.params.routeNumber,
      });
      if (!route)
        return res
          .status(404)
          .json({ success: false, message: "Route not found" });
      res.json({ success: true, message: "Route deleted" });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
