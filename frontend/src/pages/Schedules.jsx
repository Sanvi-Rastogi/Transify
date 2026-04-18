import { useEffect, useState } from "react";
import { getSchedules, createSchedule } from "../api/client";
import DelayBadge from "../components/DelayBadge";

export default function Schedules({ scheduleUpdates }) {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    vehicleId: "",
    routeNumber: "",
    date: "",
    tripNumber: 1,
  });
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    getSchedules()
      .then((r) => setSchedules(r.data.data))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);

  // Refresh on live schedule updates
  useEffect(() => {
    if (scheduleUpdates.length > 0) load();
  }, [scheduleUpdates.length]);

  const handleCreate = async () => {
    try {
      await createSchedule(form);
      setForm({ vehicleId: "", routeNumber: "", date: "", tripNumber: 1 });
      setShowForm(false);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    }
  };

  const inputStyle = {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "8px 12px",
    borderRadius: "2px",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    width: "100%",
    outline: "none",
  };
  const btnStyle = (accent = "var(--accent)") => ({
    background: "transparent",
    border: `1px solid ${accent}`,
    color: accent,
    padding: "8px 18px",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "1.5px",
    fontFamily: "var(--font-mono)",
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            Schedules
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "11px",
              letterSpacing: "1px",
              marginTop: "4px",
            }}
          >
            {schedules.length} TRIPS LOGGED
          </p>
        </div>
        <button style={btnStyle()} onClick={() => setShowForm(!showForm)}>
          + LOG SCHEDULE
        </button>
      </div>

      {/* Live update feed */}
      {scheduleUpdates.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--warn)",
            borderRadius: "2px",
            padding: "12px 16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "var(--warn)",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            LIVE UPDATES
          </div>
          {scheduleUpdates.slice(0, 3).map((u, i) => (
            <div
              key={i}
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                padding: "4px 0",
              }}
            >
              Route{" "}
              <span style={{ color: "var(--accent)" }}>{u.routeNumber}</span> —{" "}
              {u.vehicleId} —{" "}
              <span
                style={{
                  color:
                    u.overallStatus === "delayed"
                      ? "var(--warn)"
                      : "var(--accent3)",
                }}
              >
                {u.overallStatus?.toUpperCase()}
              </span>{" "}
              {u.totalDelay > 0 ? `+${u.totalDelay}m` : ""}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--accent)",
            borderRadius: "2px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            NEW SCHEDULE ENTRY
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {[
              ["vehicleId", "Vehicle ID"],
              ["routeNumber", "Route Number"],
              ["date", "Date (YYYY-MM-DD)"],
              ["tripNumber", "Trip Number"],
            ].map(([k, label]) => (
              <div key={k}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--muted)",
                    letterSpacing: "1px",
                    marginBottom: "5px",
                  }}
                >
                  {label.toUpperCase()}
                </div>
                <input
                  style={inputStyle}
                  value={form[k]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [k]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={btnStyle("var(--accent3)")} onClick={handleCreate}>
              CREATE
            </button>
            <button
              style={btnStyle("var(--muted)")}
              onClick={() => setShowForm(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: "12px" }}>
        {schedules.map((s) => (
          <div
            key={s._id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {s.routeNumber}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginTop: "2px",
                }}
              >
                Trip #{s.tripNumber}
              </div>
            </div>
            <div style={{ fontSize: "11px" }}>
              <div style={{ color: "var(--muted)", letterSpacing: "1px" }}>
                VEHICLE
              </div>
              <div style={{ marginTop: "3px" }}>{s.vehicleId}</div>
            </div>
            <div style={{ fontSize: "11px" }}>
              <div style={{ color: "var(--muted)", letterSpacing: "1px" }}>
                DATE
              </div>
              <div style={{ marginTop: "3px" }}>{s.date}</div>
            </div>
            <div style={{ fontSize: "11px" }}>
              <div style={{ color: "var(--muted)", letterSpacing: "1px" }}>
                STOPS
              </div>
              <div style={{ marginTop: "3px" }}>{s.stops?.length ?? 0}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <DelayBadge status={s.overallStatus} delay={s.totalDelay} />
            </div>
          </div>
        ))}
        {schedules.length === 0 && (
          <div style={{ color: "var(--muted)", fontSize: "13px" }}>
            No schedules found.
          </div>
        )}
      </div>
    </div>
  );
}
