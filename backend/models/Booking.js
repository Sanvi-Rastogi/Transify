const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String },
    routeNumber: { type: String, required: true },
    routeName: { type: String },
    vehicleId: { type: String, required: true },
    vehicleType: { type: String },
    fromStop: { type: String, required: true },
    toStop: { type: String, required: true },
    travelDate: { type: String, required: true },
    seatNumber: { type: Number },
    fare: { type: Number },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    bookingRef: { type: String, unique: true },
  },
  { timestamps: true },
);

bookingSchema.pre("save", function (next) {
  if (!this.bookingRef) {
    this.bookingRef =
      "TXN" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
