import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import RoutesPage from "./pages/Routes";
import Schedules from "./pages/Schedules";
import Predictions from "./pages/Predictions";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import { useSocket } from "./hooks/useSocket";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const { connected, locationUpdates, scheduleUpdates } = useSocket();

  const allLiveUpdates = Object.values(locationUpdates).sort(
    (a, b) =>
      new Date(b.location?.lastUpdated) - new Date(a.location?.lastUpdated),
  );

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const isScheduler = user.role === "scheduler";

  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar connected={connected} user={user} onLogout={handleLogout} />
        <main
          style={{
            marginLeft: "220px",
            flex: 1,
            padding: "40px 36px",
            minHeight: "100vh",
            background: "var(--bg)",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Dashboard liveUpdates={allLiveUpdates} />}
            />
            <Route path="/predictions" element={<Predictions />} />

            {/* Scheduler only */}
            {isScheduler && (
              <Route
                path="/vehicles"
                element={<Vehicles locationUpdates={locationUpdates} />}
              />
            )}
            {isScheduler && <Route path="/routes" element={<RoutesPage />} />}
            {isScheduler && (
              <Route
                path="/schedules"
                element={<Schedules scheduleUpdates={scheduleUpdates} />}
              />
            )}

            {/* User only */}
            {!isScheduler && (
              <Route path="/bookings" element={<Bookings user={user} />} />
            )}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
