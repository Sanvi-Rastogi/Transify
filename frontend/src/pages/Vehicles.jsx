import { useEffect, useState } from "react";
import { getVehicles, createVehicle, deleteVehicle } from "../api/client";
import VehicleCard from "../components/VehicleCard";

const emptyForm = {
  vehicleId: "",
  type: "bus",
  routeNumber: "",
  capacity: "",
  currentOccupancy: "",
  driver: "",
  status: "idle",
};

export default function Vehicles({ locationUpdates }) {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = () =>
    getVehicles()
      .then((r) => setVehicles(r.data.data))
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      await createVehicle({
        ...form,
        capacity: Number(form.capacity),
        currentOccupancy: Number(form.currentOccupancy),
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!confirm(`Delete ${vehicleId}?`)) return;
    await deleteVehicle(vehicleId);
    load();
  };

  const filtered =
    filter === "all"
      ? vehicles
      : vehicles.filter((v) => v.type === filter || v.status === filter);

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
            Vehicles
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "11px",
              letterSpacing: "1px",
              marginTop: "4px",
            }}
          >
            {vehicles.length} REGISTERED
          </p>
        </div>
        <button style={btnStyle()} onClick={() => setShowForm(!showForm)}>
          + ADD VEHICLE
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["all", "bus", "train", "on-route", "idle", "maintenance"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...btnStyle(filter === f ? "var(--accent)" : "var(--border)"),
              color: filter === f ? "var(--accent)" : "var(--muted)",
              fontSize: "10px",
              padding: "5px 12px",
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Form */}
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
            NEW VEHICLE
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
              ["capacity", "Capacity"],
              ["currentOccupancy", "Occupancy"],
              ["driver", "Driver"],
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map((v) => (
          <div key={v.vehicleId} style={{ position: "relative" }}>
            <VehicleCard vehicle={v} liveData={locationUpdates[v.vehicleId]} />
            <button
              onClick={() => handleDelete(v.vehicleId)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "transparent",
                border: "none",
                color: "var(--danger)",
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              color: "var(--muted)",
              fontSize: "13px",
              gridColumn: "1/-1",
            }}
          >
            No vehicles found.
          </div>
        )}
      </div>
    </div>
  );
}
