const mongoose = require("mongoose");

const scheduleEntrySchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  actualTime: { type: String },
  status: {
    type: String,
    enum: ["on-time", "delayed", "cancelled", "arrived"],
    default: "on-time",
  },
});

const scheduleSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true },
    routeNumber: { type: String, required: true },
    date: { type: String, required: true },
    tripNumber: { type: Number, default: 1 },
    stops: [scheduleEntrySchema],
    overallStatus: {
      type: String,
      enum: ["on-time", "delayed", "cancelled"],
      default: "on-time",
    },
    totalDelay: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Schedule", scheduleSchema);
