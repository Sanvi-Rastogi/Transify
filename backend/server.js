require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cron = require("node-cron");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

connectDB();

app.use(cors());
app.use(express.json());
app.set("io", io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/routes", require("./routes/routes"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/schedules", require("./routes/schedules"));
app.use("/api/predictions", require("./routes/predictions"));
app.use("/api/bookings", require("./routes/bookings"));

app.get("/api/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() }),
);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("subscribe-vehicle", (vehicleId) =>
    socket.join(`vehicle-${vehicleId}`),
  );
  socket.on("disconnect", () =>
    console.log(`Client disconnected: ${socket.id}`),
  );
});

cron.schedule("*/10 * * * * *", async () => {
  try {
    const Vehicle = require("./models/Vehicle");
    const vehicles = await Vehicle.find({ status: "on-route" });
    vehicles.forEach((v) => {
      io.emit("vehicle-location-update", {
        vehicleId: v.vehicleId,
        location: {
          lat: v.location.lat + (Math.random() - 0.5) * 0.001,
          lng: v.location.lng + (Math.random() - 0.5) * 0.001,
          lastUpdated: new Date(),
        },
        speed: Math.floor(20 + Math.random() * 50),
        status: v.status,
      });
    });
  } catch (e) {}
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
