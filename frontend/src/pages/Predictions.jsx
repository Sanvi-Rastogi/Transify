import { useEffect, useState } from "react";
import {
  getVehicles,
  getDelayPrediction,
  getOptimalSchedule,
  getRoutes,
} from "../api/client";

export default function Predictions() {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [delayResult, setDelayResult] = useState(null);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVehicles()
      .then((r) => setVehicles(r.data.data))
      .catch(() => {});
    getRoutes()
      .then((r) => setRoutes(r.data.data))
      .catch(() => {});
  }, []);

  const runDelay = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const r = await getDelayPrediction(selectedVehicle);
      setDelayResult(r.data.data);
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  const runOptimal = async () => {
    if (!selectedRoute) return;
    setLoading(true);
    try {
      const r = await getOptimalSchedule(selectedRoute);
      setScheduleResult(r.data.data);
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  const selectStyle = {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "10px 14px",
    borderRadius: "2px",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    width: "100%",
    outline: "none",
    cursor: "pointer",
  };
  const btnStyle = (accent = "var(--accent)") => ({
    background: "transparent",
    border: `1px solid ${accent}`,
    color: accent,
    padding: "10px 22px",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "1.5px",
    fontFamily: "var(--font-mono)",
  });
  const resultRow = (label, value, color = "var(--text)") => (
    <div
      key={label}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
        fontSize: "12px",
      }}
    >
      <span style={{ color: "var(--muted)", letterSpacing: "1px" }}>
        {label.toUpperCase()}
      </span>
      <span style={{ color }}>{value}</span>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 800,
          }}
        >
          Predictions
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "11px",
            letterSpacing: "1px",
            marginTop: "4px",
          }}
        >
          AI-POWERED DELAY & SCHEDULE INTELLIGENCE
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        {/* Delay Prediction */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderTop: "2px solid var(--warn)",
            borderRadius: "2px",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              color: "var(--warn)",
              marginBottom: "20px",
            }}
          >
            DELAY PREDICTOR
          </div>
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--muted)",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}
            >
              SELECT VEHICLE
            </div>
            <select
              style={selectStyle}
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="">-- Choose vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.vehicleId} ({v.type} — {v.routeNumber})
                </option>
              ))}
            </select>
          </div>
          <button
            style={btnStyle("var(--warn)")}
            onClick={runDelay}
            disabled={loading}
          >
            {loading ? "RUNNING..." : "RUN PREDICTION"}
          </button>

          {delayResult && (
            <div style={{ marginTop: "20px" }}>
              {resultRow("Vehicle", delayResult.vehicleId, "var(--accent)")}
              {resultRow(
                "Current Delay",
                `${delayResult.currentDelay} min`,
                delayResult.currentDelay > 0 ? "var(--warn)" : "var(--accent3)",
              )}
              {resultRow(
                "Predicted Delay",
                `${delayResult.predictedDelay} min`,
                delayResult.predictedDelay > 5
                  ? "var(--danger)"
                  : "var(--accent3)",
              )}
              {resultRow("Confidence", delayResult.confidence, "var(--accent)")}
              {resultRow(
                "Peak Hour",
                delayResult.factors?.isPeakHour ? "Yes" : "No",
                delayResult.factors?.isPeakHour
                  ? "var(--warn)"
                  : "var(--accent3)",
              )}
              {resultRow("Occupancy", delayResult.factors?.occupancyRatio)}
              {resultRow("Speed", delayResult.factors?.currentSpeed)}
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px",
                  background: "rgba(255,184,0,0.05)",
                  border: "1px solid var(--warn)",
                  borderRadius: "2px",
                  fontSize: "11px",
                  color: "var(--warn)",
                }}
              >
                ⚠ {delayResult.recommendation}
              </div>
            </div>
          )}
        </div>

        {/* Optimal Schedule */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderTop: "2px solid var(--accent3)",
            borderRadius: "2px",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              color: "var(--accent3)",
              marginBottom: "20px",
            }}
          >
            OPTIMAL SCHEDULING
          </div>
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "var(--muted)",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}
            >
              SELECT ROUTE
            </div>
            <select
              style={selectStyle}
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
            >
              <option value="">-- Choose route --</option>
              {routes.map((r) => (
                <option key={r.routeNumber} value={r.routeNumber}>
                  {r.routeNumber} — {r.name}
                </option>
              ))}
            </select>
          </div>
          <button
            style={btnStyle("var(--accent3)")}
            onClick={runOptimal}
            disabled={loading}
          >
            {loading ? "RUNNING..." : "OPTIMIZE"}
          </button>

          {scheduleResult && (
            <div style={{ marginTop: "20px" }}>
              {resultRow("Route", scheduleResult.routeNumber, "var(--accent)")}
              {resultRow("Total Vehicles", scheduleResult.totalVehicles)}
              {resultRow(
                "Active Vehicles",
                scheduleResult.activeVehicles,
                "var(--accent3)",
              )}
              {resultRow(
                "Avg Delay",
                scheduleResult.averageDelay,
                scheduleResult.averageDelay === "0 minutes"
                  ? "var(--accent3)"
                  : "var(--warn)",
              )}
              {resultRow(
                "Recommended Headway",
                scheduleResult.recommendedHeadway,
                "var(--accent)",
              )}
              <div style={{ marginTop: "14px" }}>
                {scheduleResult.suggestions?.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      padding: "6px 0",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "var(--accent3)" }}>▸</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
