const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true, unique: true },
    type: { type: String, enum: ["bus", "train"], required: true },
    routeNumber: { type: String, ref: "Route" },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
    speed: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["on-route", "at-stop", "idle", "maintenance"],
      default: "idle",
    },
    currentStop: { type: String, default: null },
    nextStop: { type: String, default: null },
    delayMinutes: { type: Number, default: 0 },
    driver: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
