import { useEffect, useState } from "react";
import { getRoutes, createRoute, deleteRoute } from "../api/client";
import DelayBadge from "../components/DelayBadge";

const emptyForm = {
  routeNumber: "",
  name: "",
  type: "bus",
  estimatedDuration: "",
  distance: "",
};

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    getRoutes()
      .then((r) => setRoutes(r.data.data))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      await createRoute({
        ...form,
        estimatedDuration: Number(form.estimatedDuration),
        distance: Number(form.distance),
      });
      setForm(emptyForm);
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
            Routes
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "11px",
              letterSpacing: "1px",
              marginTop: "4px",
            }}
          >
            {routes.length} CONFIGURED
          </p>
        </div>
        <button style={btnStyle()} onClick={() => setShowForm(!showForm)}>
          + ADD ROUTE
        </button>
      </div>

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
            NEW ROUTE
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
              ["routeNumber", "Route Number"],
              ["name", "Name"],
              ["estimatedDuration", "Est. Duration (min)"],
              ["distance", "Distance (km)"],
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
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--muted)",
                  letterSpacing: "1px",
                  marginBottom: "5px",
                }}
              >
                TYPE
              </div>
              <select
                style={inputStyle}
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option value="bus">Bus</option>
                <option value="train">Train</option>
              </select>
            </div>
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
        {routes.map((r) => (
          <div
            key={r.routeNumber}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              padding: "18px 20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "17px",
                  color: "var(--accent)",
                }}
              >
                {r.routeNumber}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginTop: "2px",
                }}
              >
                {r.name}
              </div>
            </div>
            <div style={{ fontSize: "11px" }}>
              <div style={{ color: "var(--muted)", letterSpacing: "1px" }}>
                TYPE
              </div>
              <div
                style={{
                  marginTop: "3px",
                  color: r.type === "bus" ? "var(--accent2)" : "var(--accent)",
                }}
              >
                {r.type?.toUpperCase()}
              </div>
            </div>
            <div style={{ fontSize: "11px" }}>
              <div style={{ color: "var(--muted)", letterSpacing: "1px" }}>
                DURATION
              </div>
              <div style={{ marginTop: "3px" }}>
                {r.estimatedDuration ? `${r.estimatedDuration} min` : "—"}
              </div>
            </div>
            <div style={{ fontSize: "11px" }}>
              <div style={{ color: "var(--muted)", letterSpacing: "1px" }}>
                STOPS
              </div>
              <div style={{ marginTop: "3px" }}>{r.stops?.length ?? 0}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <DelayBadge status={r.status} delay={0} />
              <button
                onClick={() => {
                  if (confirm(`Delete ${r.routeNumber}?`))
                    deleteRoute(r.routeNumber).then(load);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--danger)",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {routes.length === 0 && (
          <div style={{ color: "var(--muted)", fontSize: "13px" }}>
            No routes found.
          </div>
        )}
      </div>
    </div>
  );
}
