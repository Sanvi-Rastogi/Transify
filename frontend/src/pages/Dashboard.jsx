import { useEffect, useState } from "react";
import { getSummary } from "../api/client";
import StatCard from "../components/StatCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockTrend = Array.from({ length: 12 }, (_, i) => ({
  time: `${String(i * 2).padStart(2, "0")}:00`,
  vehicles: Math.floor(10 + Math.random() * 20),
  delays: Math.floor(Math.random() * 8),
}));

export default function Dashboard({ liveUpdates }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getSummary()
      .then((r) => setSummary(r.data.data))
      .catch(() => {});
  }, []);

  const healthColor =
    summary?.networkHealth === "Good"
      ? "var(--accent3)"
      : summary?.networkHealth === "Fair"
        ? "var(--warn)"
        : "var(--danger)";

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-1px",
          }}
        >
          Network Overview
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "12px",
            marginTop: "4px",
            letterSpacing: "1px",
          }}
        >
          REAL-TIME TRANSPORT INTELLIGENCE
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          label="Total Vehicles"
          value={summary?.totalVehicles ?? "—"}
          accent="var(--accent)"
          pulse
        />
        <StatCard
          label="On Route"
          value={summary?.onRouteVehicles ?? "—"}
          accent="var(--accent3)"
          pulse
        />
        <StatCard
          label="Idle"
          value={summary?.idleVehicles ?? "—"}
          accent="var(--muted)"
        />
        <StatCard
          label="Active Routes"
          value={summary?.activeRoutes ?? "—"}
          accent="var(--accent2)"
        />
        <StatCard
          label="Delays Today"
          value={summary?.delayedTripsToday ?? "—"}
          accent="var(--warn)"
        />
        <StatCard
          label="Network Health"
          value={summary?.networkHealth ?? "—"}
          accent={healthColor}
        />
      </div>

      {/* Live feed */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "2px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            VEHICLE ACTIVITY TREND
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockTrend}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "#4a6070", fontFamily: "DM Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#4a6070", fontFamily: "DM Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0d1117",
                  border: "1px solid #1e2a35",
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontFamily: "DM Mono",
                }}
              />
              <Area
                type="monotone"
                dataKey="vehicles"
                stroke="#00e5ff"
                strokeWidth={2}
                fill="url(#grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "2px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            LIVE SOCKET EVENTS
          </div>
          <div style={{ height: "180px", overflowY: "auto" }}>
            {liveUpdates.length === 0 ? (
              <div style={{ color: "var(--muted)", fontSize: "12px" }}>
                Waiting for events...
              </div>
            ) : (
              liveUpdates.map((u, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "11px",
                    padding: "6px 0",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    color: i === 0 ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  <span>{u.vehicleId}</span>
                  <span>{u.speed ?? "?"} km/h</span>
                  <span style={{ color: "var(--accent3)" }}>
                    {u.status?.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
