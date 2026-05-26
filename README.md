# 🚌 Transify — Public Transport Optimization Platform
A full-stack real-time public transport management system built with Node.js, Express, MongoDB, Socket.IO, and React. Supports two roles — **Scheduler** (manages routes, vehicles, schedules) and **Traveller** (books tickets, tracks journeys).


## 🖥️ Features

### Scheduler
- Add, update, and delete **routes**, **vehicles**, and **schedules**
- Monitor **live vehicle locations** updated in real time via Socket.IO
- View **network summary** — active routes, vehicles on route, delays
- Run **delay estimation** based on peak hours, occupancy, and speed
- Get **optimal scheduling suggestions** per route

### Traveller
- Browse all available Indian transit routes
- **Book tickets** with automatic seat assignment and fare calculation
- View and **cancel bookings** from a personal dashboard
- See live vehicle feed on the dashboard


## 🗂️ Project Structure

transify/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Route.js
│   │   ├── Vehicle.js
│   │   ├── Schedule.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── routes.js
│   │   ├── vehicles.js
│   │   ├── schedules.js
│   │   ├── bookings.js
│   │   └── predictions.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── VehicleCard.jsx
    │   │   └── DelayBadge.jsx
    │   ├── hooks/
    │   │   └── useSocket.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Vehicles.jsx
    │   │   ├── Routes.jsx
    │   │   ├── Schedules.jsx
    │   │   ├── Predictions.jsx
    │   │   └── Bookings.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Tech Stack
| Backend - Node.js, Express.js |
| Database - MongoDB, Mongoose |
| Real-time - Socket.IO |
| Auth - JWT, bcryptjs |
| Scheduling - node-cron |
| Frontend - React, Vite |


## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/transify.git
cd transify
```

### 2. Setup backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/transport_platform?retryWrites=true&w=majority&appName=Cluster0
PORT=5001
JWT_SECRET=transitOS_secret_2024
```

### 3. Seed sample data
```bash
node seed.js
```

This creates 6 Indian city routes, 10 vehicles, schedules, and two demo accounts.

### 4. Start the backend
```bash
npm run dev
```

### 5. Setup and start the frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`


## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Traveller | user@transit.in | user1234 |
| Scheduler | scheduler@transit.in | sched1234 |


## 🗺️ Sample Data — Indian Routes

| Route | Name | Type | Cities |
|---|---|---|---|
| DEL-01 | Delhi Metro — Blue Line | Train | Dwarka → Noida Sector 62 |
| MUM-01 | Mumbai Local — Western | Train | Churchgate → Virar |
| BLR-01 | Bangalore BMTC Express | Bus | Kempegowda → Electronic City |
| CHN-01 | Chennai MTC | Bus | Chennai Central → Tambaram |
| HYD-01 | Hyderabad MMTS | Train | Lingampally → Falaknuma |
| JAI-01 | Jaipur Low Floor Bus | Bus | Sindhi Camp → Mansarovar |
