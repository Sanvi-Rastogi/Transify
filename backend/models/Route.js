const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  order: { type: Number, required: true },
});

const routeSchema = new mongoose.Schema(
  {
    routeNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["bus", "train"], required: true },
    stops: [stopSchema],
    distance: { type: Number },
    estimatedDuration: { type: Number },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Route", routeSchema);
