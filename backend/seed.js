require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Route = require("./models/Route");
const Vehicle = require("./models/Vehicle");
const Schedule = require("./models/Schedule");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/transport_platform";

const routes = [
  {
    routeNumber: "DEL-01",
    name: "Delhi Metro Line — Blue",
    type: "train",
    status: "active",
    distance: 50,
    estimatedDuration: 65,
    stops: [
      { name: "Dwarka Sector 21", lat: 28.5518, lng: 77.0588, order: 1 },
      { name: "Rajiv Chowk", lat: 28.6328, lng: 77.2197, order: 2 },
      { name: "Mandi House", lat: 28.6267, lng: 77.2391, order: 3 },
      { name: "Yamuna Bank", lat: 28.627, lng: 77.2901, order: 4 },
      { name: "Noida Sector 62", lat: 28.6276, lng: 77.3637, order: 5 },
    ],
  },
  {
    routeNumber: "MUM-01",
    name: "Mumbai Local — Western",
    type: "train",
    status: "active",
    distance: 60,
    estimatedDuration: 75,
    stops: [
      { name: "Churchgate", lat: 18.9322, lng: 72.8264, order: 1 },
      { name: "Dadar", lat: 19.0176, lng: 72.8426, order: 2 },
      { name: "Borivali", lat: 19.2288, lng: 72.8569, order: 3 },
      { name: "Vasai Road", lat: 19.366, lng: 72.8327, order: 4 },
      { name: "Virar", lat: 19.4593, lng: 72.8101, order: 5 },
    ],
  },
  {
    routeNumber: "BLR-01",
    name: "Bangalore BMTC — Kempegowda to Electronic City",
    type: "bus",
    status: "active",
    distance: 32,
    estimatedDuration: 75,
    stops: [
      { name: "Kempegowda Bus Stand", lat: 12.978, lng: 77.572, order: 1 },
      { name: "Majestic", lat: 12.9773, lng: 77.5713, order: 2 },
      { name: "Silk Board", lat: 12.9172, lng: 77.6219, order: 3 },
      { name: "HSR Layout", lat: 12.9116, lng: 77.6389, order: 4 },
      { name: "Electronic City", lat: 12.8451, lng: 77.66, order: 5 },
    ],
  },
  {
    routeNumber: "CHN-01",
    name: "Chennai MTC — Central to Tambaram",
    type: "bus",
    status: "active",
    distance: 28,
    estimatedDuration: 60,
    stops: [
      { name: "Chennai Central", lat: 13.0827, lng: 80.2751, order: 1 },
      { name: "T. Nagar", lat: 13.0418, lng: 80.2341, order: 2 },
      { name: "Adyar", lat: 13.0002, lng: 80.2565, order: 3 },
      { name: "Chromepet", lat: 12.9516, lng: 80.1462, order: 4 },
      { name: "Tambaram", lat: 12.9249, lng: 80.1, order: 5 },
    ],
  },
  {
    routeNumber: "HYD-01",
    name: "Hyderabad MMTS — Lingampally to Falaknuma",
    type: "train",
    status: "active",
    distance: 45,
    estimatedDuration: 55,
    stops: [
      { name: "Lingampally", lat: 17.4948, lng: 78.3202, order: 1 },
      { name: "Hitech City", lat: 17.4474, lng: 78.3762, order: 2 },
      { name: "Begumpet", lat: 17.4417, lng: 78.4678, order: 3 },
      { name: "Nampally", lat: 17.3902, lng: 78.4738, order: 4 },
      { name: "Falaknuma", lat: 17.3293, lng: 78.4738, order: 5 },
    ],
  },
  {
    routeNumber: "JAI-01",
    name: "Jaipur Low Floor Bus — Sindhi Camp to Mansarovar",
    type: "bus",
    status: "active",
    distance: 15,
    estimatedDuration: 40,
    stops: [
      { name: "Sindhi Camp", lat: 26.9124, lng: 75.7873, order: 1 },
      { name: "MI Road", lat: 26.9155, lng: 75.7976, order: 2 },
      { name: "New Gate", lat: 26.922, lng: 75.8152, order: 3 },
      { name: "Tonk Road", lat: 26.8891, lng: 75.8074, order: 4 },
      { name: "Mansarovar", lat: 26.8537, lng: 75.7781, order: 5 },
    ],
  },
];

const vehicles = [
  {
    vehicleId: "DEL-T01",
    type: "train",
    routeNumber: "DEL-01",
    capacity: 200,
    currentOccupancy: 120,
    location: { lat: 28.5518, lng: 77.0588 },
    status: "on-route",
    driver: "Rajesh Kumar",
    speed: 65,
  },
  {
    vehicleId: "DEL-T02",
    type: "train",
    routeNumber: "DEL-01",
    capacity: 200,
    currentOccupancy: 80,
    location: { lat: 28.6328, lng: 77.2197 },
    status: "on-route",
    driver: "Suresh Singh",
    speed: 55,
  },
  {
    vehicleId: "MUM-T01",
    type: "train",
    routeNumber: "MUM-01",
    capacity: 300,
    currentOccupancy: 260,
    location: { lat: 18.9322, lng: 72.8264 },
    status: "on-route",
    driver: "Pradeep Patil",
    speed: 70,
  },
  {
    vehicleId: "MUM-T02",
    type: "train",
    routeNumber: "MUM-01",
    capacity: 300,
    currentOccupancy: 190,
    location: { lat: 19.0176, lng: 72.8426 },
    status: "on-route",
    driver: "Vinod Rane",
    speed: 60,
  },
  {
    vehicleId: "BLR-B01",
    type: "bus",
    routeNumber: "BLR-01",
    capacity: 60,
    currentOccupancy: 45,
    location: { lat: 12.978, lng: 77.572 },
    status: "on-route",
    driver: "Manjunath Reddy",
    speed: 30,
  },
  {
    vehicleId: "BLR-B02",
    type: "bus",
    routeNumber: "BLR-01",
    capacity: 60,
    currentOccupancy: 20,
    location: { lat: 12.9172, lng: 77.6219 },
    status: "on-route",
    driver: "Anand Kumar",
    speed: 25,
  },
  {
    vehicleId: "CHN-B01",
    type: "bus",
    routeNumber: "CHN-01",
    capacity: 55,
    currentOccupancy: 30,
    location: { lat: 13.0827, lng: 80.2751 },
    status: "on-route",
    driver: "Murugan S",
    speed: 28,
  },
  {
    vehicleId: "HYD-T01",
    type: "train",
    routeNumber: "HYD-01",
    capacity: 150,
    currentOccupancy: 90,
    location: { lat: 17.4948, lng: 78.3202 },
    status: "on-route",
    driver: "Ravi Shankar",
    speed: 50,
  },
  {
    vehicleId: "JAI-B01",
    type: "bus",
    routeNumber: "JAI-01",
    capacity: 45,
    currentOccupancy: 18,
    location: { lat: 26.9124, lng: 75.7873 },
    status: "on-route",
    driver: "Mohan Sharma",
    speed: 22,
  },
  {
    vehicleId: "JAI-B02",
    type: "bus",
    routeNumber: "JAI-01",
    capacity: 45,
    currentOccupancy: 5,
    location: { lat: 26.8891, lng: 75.8074 },
    status: "idle",
    driver: "Deepak Verma",
    speed: 0,
  },
];

const today = new Date().toISOString().split("T")[0];

const schedules = vehicles
  .filter((v) => v.status === "on-route")
  .map((v, i) => {
    const route = routes.find((r) => r.routeNumber === v.routeNumber);
    return {
      vehicleId: v.vehicleId,
      routeNumber: v.routeNumber,
      date: today,
      tripNumber: 1,
      overallStatus: i % 4 === 0 ? "delayed" : "on-time",
      totalDelay: i % 4 === 0 ? 10 : 0,
      stops: route.stops.map((s, idx) => ({
        stopName: s.name,
        scheduledTime: `${String(6 + idx * 2 + i).padStart(2, "0")}:00`,
        status: idx === 0 ? "arrived" : "on-time",
      })),
    };
  });

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear existing
  await Promise.all([
    User.deleteMany({}),
    Route.deleteMany({}),
    Vehicle.deleteMany({}),
    Schedule.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  // Create users
  await User.create([
    {
      name: "Arjun Mehta",
      email: "user@transit.in",
      password: "user1234",
      role: "user",
    },
    {
      name: "Priya Scheduler",
      email: "scheduler@transit.in",
      password: "sched1234",
      role: "scheduler",
    },
  ]);
  console.log("Users seeded");

  await Route.insertMany(routes);
  console.log("Routes seeded");

  await Vehicle.insertMany(vehicles);
  console.log("Vehicles seeded");

  await Schedule.insertMany(schedules);
  console.log("Schedules seeded");

  console.log("\n✅ Seed complete!");
  console.log("   USER     → user@transit.in / user1234");
  console.log("   SCHEDULER → scheduler@transit.in / sched1234");
  mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  mongoose.disconnect();
});
