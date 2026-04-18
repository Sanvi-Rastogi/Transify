import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getHealth = () => api.get("/health");

// Auth
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const getMe = () => api.get("/auth/me");

// Vehicles
export const getVehicles = (params) => api.get("/vehicles", { params });
export const createVehicle = (data) => api.post("/vehicles", data);
export const updateLocation = (vehicleId, data) =>
  api.put(`/vehicles/${vehicleId}/location`, data);
export const updateOccupancy = (vehicleId, data) =>
  api.put(`/vehicles/${vehicleId}/occupancy`, data);
export const deleteVehicle = (vehicleId) =>
  api.delete(`/vehicles/${vehicleId}`);

// Routes
export const getRoutes = (params) => api.get("/routes", { params });
export const createRoute = (data) => api.post("/routes", data);
export const deleteRoute = (routeNumber) =>
  api.delete(`/routes/${routeNumber}`);

// Schedules
export const getSchedules = (params) => api.get("/schedules", { params });
export const createSchedule = (data) => api.post("/schedules", data);

// Predictions
export const getSummary = () => api.get("/predictions/summary");
export const getDelayPrediction = (vehicleId) =>
  api.get(`/predictions/delay/${vehicleId}`);
export const getOptimalSchedule = (routeNumber) =>
  api.get(`/predictions/optimal-schedule/${routeNumber}`);

// Bookings
export const getMyBookings = () => api.get("/bookings/my");
export const getAllBookings = () => api.get("/bookings");
export const createBooking = (data) => api.post("/bookings", data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);
