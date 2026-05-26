# 🚌 Transify — Public Transport Optimization Platform
A full-stack real-time public transport management system built using Node.js, Express.js, MongoDB, Socket.IO, and React.

The platform supports two user roles:

- **Scheduler** — manages routes, vehicles, schedules, and monitoring
- **Traveller** — books tickets and tracks journeys in real time


# 🖥️ Features

## Scheduler
- Add, update, and delete routes, vehicles, and schedules
- Monitor live vehicle locations using Socket.IO
- View network analytics and delay summaries
- Run delay estimation based on occupancy, speed, and peak hours
- Generate optimized schedule suggestions

## Traveller
- Browse available Indian transit routes
- Book tickets with automatic seat allocation
- View and cancel bookings
- Track live vehicle updates from the dashboard


# 🗂️ Project Structure

```txt
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
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── VehicleCard.jsx
│   │   │   └── DelayBadge.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   ├── Routes.jsx
│   │   │   ├── Schedules.jsx
│   │   │   ├── Predictions.jsx
│   │   │   └── Bookings.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
```


# Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-time Communication | Socket.IO |
| Authentication | JWT, bcryptjs |
| Task Scheduling | node-cron |
| Frontend | React, Vite |


# Getting Started

## Prerequisites
- Node.js v18+
- MongoDB Atlas or Local MongoDB


## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/transify.git
cd transify
```


## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/transport_platform?retryWrites=true&w=majority&appName=Cluster0
PORT=5001
JWT_SECRET=transitOS_secret_2024
```


## 3️⃣ Seed Sample Data

```bash
node seed.js
```

This creates:
- Sample Indian transit routes
- Vehicles and schedules
- Demo traveller and scheduler accounts


## 4️⃣ Start Backend Server

```bash
npm run dev
```

Backend runs at:

```txt
http://localhost:5001
```


## 5️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```


# 🔐 Demo Credentials

| Role | Email | Password |
|------|--------|-----------|
| Traveller | user@transit.in | user1234 |
| Scheduler | scheduler@transit.in | sched1234 |


# 🗺️ Sample Transit Routes

| Route ID | Name | Type | Cities |
|----------|------|------|---------|
| DEL-01 | Delhi Metro — Blue Line | Train | Dwarka → Noida Sector 62 |
| MUM-01 | Mumbai Local — Western | Train | Churchgate → Virar |
| BLR-01 | Bangalore BMTC Express | Bus | Kempegowda → Electronic City |
| CHN-01 | Chennai MTC | Bus | Chennai Central → Tambaram |
| HYD-01 | Hyderabad MMTS | Train | Lingampally → Falaknuma |
| JAI-01 | Jaipur Low Floor Bus | Bus | Sindhi Camp → Mansarovar |
