import { useEffect, useState } from "react";
import {
  getRoutes,
  getVehicles,
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../api/client";

export default function Bookings({ user }) {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [tab, setTab] = useState("book");
  const [form, setForm] = useState({
    routeNumber: "",
    vehicleId: "",
    fromStop: "",
    toStop: "",
    travelDate: "",
  });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRoutes()
      .then((r) => setRoutes(r.data.data))
      .catch(() => {});
    getVehicles()
      .then((r) => setVehicles(r.data.data))
      .catch(() => {});
    loadBookings();
  }, []);

  const loadBookings = () =>
    getMyBookings()
      .then((r) => setMyBookings(r.data.data))
      .catch(() => {});

  const handleRouteChange = (routeNumber) => {
    const route = routes.find((r) => r.routeNumber === routeNumber);
    setSelectedRoute(route || null);
    const rv = vehicles.filter((v) => v.routeNumber === routeNumber);
    setFilteredVehicles(rv);
    setForm((p) => ({
      ...p,
      routeNumber,
      vehicleId: "",
      fromStop: "",
      toStop: "",
    }));
  };

  const handleBook = async () => {
    if (
      !form.routeNumber ||
      !form.vehicleId ||
      !form.fromStop ||
      !form.toStop ||
      !form.travelDate
    )
      return alert("Please fill all fields");
    if (form.fromStop === form.toStop)
      return alert("From and To stops cannot be same");
    setLoading(true);
    try {
      const res = await createBooking(form);
      setSuccess(res.data.data);
      setForm({
        routeNumber: "",
        vehicleId: "",
        fromStop: "",
        toStop: "",
        travelDate: "",
      });
      setSelectedRoute(null);
      loadBookings();
    } catch (e) {
      alert(e.response?.data?.message || "Booking failed");
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    await cancelBooking(id);
    loadBookings();
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
  };
  const inputStyle = { ...selectStyle };
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

  const statusColor = (s) =>
    s === "confirmed"
      ? "var(--accent3)"
      : s === "cancelled"
        ? "var(--danger)"
        : "var(--muted)";

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 800,
          }}
        >
          My Travel
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "11px",
            letterSpacing: "1px",
            marginTop: "4px",
          }}
        >
          BOOK TICKETS • TRACK JOURNEYS
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          marginBottom: "28px",
          border: "1px solid var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
          width: "fit-content",
        }}
      >
        {[
          ["book", "🎫 BOOK TICKET"],
          ["my", `📋 MY BOOKINGS (${myBookings.length})`],
        ].map(([t, label]) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSuccess(null);
            }}
            style={{
              padding: "10px 24px",
              background: tab === t ? "rgba(0,229,255,0.08)" : "transparent",
              color: tab === t ? "var(--accent)" : "var(--muted)",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              letterSpacing: "1.5px",
              fontFamily: "var(--font-mono)",
              borderBottom:
                tab === t ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Success ticket */}
      {success && (
        <div
          style={{
            background: "rgba(57,255,20,0.05)",
            border: "1px solid var(--accent3)",
            borderRadius: "2px",
            padding: "24px",
            marginBottom: "24px",
            position: "relative",
          }}
        >
          <button
            onClick={() => setSuccess(null)}
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
          <div
            style={{
              fontSize: "11px",
              color: "var(--accent3)",
              letterSpacing: "2px",
              marginBottom: "16px",
            }}
          >
            ✅ BOOKING CONFIRMED
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              ["Booking Ref", success.bookingRef],
              ["Route", success.routeNumber],
              ["Vehicle", success.vehicleId],
              ["From", success.fromStop],
              ["To", success.toStop],
              ["Date", success.travelDate],
              ["Seat", `#${success.seatNumber}`],
              ["Fare", `₹${success.fare}`],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--muted)",
                    letterSpacing: "1px",
                  }}
                >
                  {k.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--accent3)",
                    marginTop: "4px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "book" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          {/* Booking form */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderTop: "2px solid var(--accent)",
              borderRadius: "2px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--accent)",
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              TICKET BOOKING
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
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
                  value={form.routeNumber}
                  onChange={(e) => handleRouteChange(e.target.value)}
                >
                  <option value="">-- Choose route --</option>
                  {routes.map((r) => (
                    <option key={r.routeNumber} value={r.routeNumber}>
                      {r.routeNumber} — {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRoute && (
                <>
                  <div>
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
                      value={form.vehicleId}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, vehicleId: e.target.value }))
                      }
                    >
                      <option value="">-- Choose vehicle --</option>
                      {filteredVehicles.map((v) => {
                        const pct = Math.round(
                          (v.currentOccupancy / v.capacity) * 100,
                        );
                        return (
                          <option key={v.vehicleId} value={v.vehicleId}>
                            {v.vehicleId} ({v.type}) — {pct}% full
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--muted)",
                          letterSpacing: "1px",
                          marginBottom: "6px",
                        }}
                      >
                        FROM STOP
                      </div>
                      <select
                        style={selectStyle}
                        value={form.fromStop}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, fromStop: e.target.value }))
                        }
                      >
                        <option value="">-- From --</option>
                        {selectedRoute.stops.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--muted)",
                          letterSpacing: "1px",
                          marginBottom: "6px",
                        }}
                      >
                        TO STOP
                      </div>
                      <select
                        style={selectStyle}
                        value={form.toStop}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, toStop: e.target.value }))
                        }
                      >
                        <option value="">-- To --</option>
                        {selectedRoute.stops.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                        marginBottom: "6px",
                      }}
                    >
                      TRAVEL DATE
                    </div>
                    <input
                      type="date"
                      style={inputStyle}
                      value={form.travelDate}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, travelDate: e.target.value }))
                      }
                    />
                  </div>

                  {/* Fare preview */}
                  {form.fromStop &&
                    form.toStop &&
                    form.fromStop !== form.toStop &&
                    (() => {
                      const stops = selectedRoute.stops;
                      const fi = stops.findIndex(
                        (s) => s.name === form.fromStop,
                      );
                      const ti = stops.findIndex((s) => s.name === form.toStop);
                      const diff = Math.abs(ti - fi);
                      const v = filteredVehicles.find(
                        (v) => v.vehicleId === form.vehicleId,
                      );
                      const base = v?.type === "train" ? 15 : 10;
                      const fare = base + diff * (v?.type === "train" ? 8 : 5);
                      return (
                        <div
                          style={{
                            background: "rgba(0,229,255,0.05)",
                            border: "1px solid var(--border)",
                            borderRadius: "2px",
                            padding: "12px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--muted)",
                              letterSpacing: "1px",
                            }}
                          >
                            ESTIMATED FARE
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "22px",
                              fontWeight: 700,
                              color: "var(--accent)",
                            }}
                          >
                            ₹{fare}
                          </span>
                        </div>
                      );
                    })()}
                </>
              )}

              <button
                style={btnStyle()}
                onClick={handleBook}
                disabled={loading}
              >
                {loading ? "BOOKING..." : "🎫 CONFIRM BOOKING"}
              </button>
            </div>
          </div>

          {/* Route info panel */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              ROUTE DETAILS
            </div>
            {!selectedRoute ? (
              <div style={{ color: "var(--muted)", fontSize: "12px" }}>
                Select a route to see details.
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: "4px",
                  }}
                >
                  {selectedRoute.routeNumber}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text)",
                    marginBottom: "16px",
                  }}
                >
                  {selectedRoute.name}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  {[
                    ["Type", selectedRoute.type?.toUpperCase()],
                    [
                      "Distance",
                      selectedRoute.distance
                        ? `${selectedRoute.distance} km`
                        : "—",
                    ],
                    [
                      "Duration",
                      selectedRoute.estimatedDuration
                        ? `${selectedRoute.estimatedDuration} min`
                        : "—",
                    ],
                    ["Total Stops", selectedRoute.stops?.length],
                  ].map(([k, v]) => (
                    <div key={k} style={{ fontSize: "11px" }}>
                      <div
                        style={{ color: "var(--muted)", letterSpacing: "1px" }}
                      >
                        {k.toUpperCase()}
                      </div>
                      <div style={{ color: "var(--text)", marginTop: "3px" }}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--muted)",
                    letterSpacing: "1.5px",
                    marginBottom: "12px",
                  }}
                >
                  STOPS
                </div>
                <div style={{ position: "relative", paddingLeft: "20px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "7px",
                      top: "8px",
                      bottom: "8px",
                      width: "1px",
                      background: "var(--border)",
                    }}
                  />
                  {selectedRoute.stops.map((s, i) => (
                    <div
                      key={s.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "-16px",
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          background:
                            i === 0 || i === selectedRoute.stops.length - 1
                              ? "var(--accent)"
                              : "var(--border)",
                          border: "2px solid var(--accent)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color:
                            i === 0 || i === selectedRoute.stops.length - 1
                              ? "var(--accent)"
                              : "var(--text)",
                        }}
                      >
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "my" && (
        <div style={{ display: "grid", gap: "12px" }}>
          {myBookings.length === 0 && (
            <div style={{ color: "var(--muted)", fontSize: "13px" }}>
              No bookings yet.
            </div>
          )}
          {myBookings.map((b) => (
            <div
              key={b._id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: `3px solid ${statusColor(b.status)}`,
                borderRadius: "2px",
                padding: "18px 20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                gap: "12px",
                alignItems: "center",
              }}
            >
              {[
                ["REF", b.bookingRef, "var(--accent)"],
                ["ROUTE", b.routeNumber, "var(--text)"],
                ["VEHICLE", b.vehicleId, "var(--text)"],
                ["FROM", b.fromStop, "var(--text)"],
                ["TO", b.toStop, "var(--text)"],
                ["DATE", b.travelDate, "var(--text)"],
                ["SEAT", `#${b.seatNumber}`, "var(--accent2)"],
                ["FARE", `₹${b.fare}`, "var(--accent3)"],
              ].map(([k, v, c]) => (
                <div key={k} style={{ fontSize: "11px" }}>
                  <div
                    style={{
                      color: "var(--muted)",
                      letterSpacing: "1px",
                      marginBottom: "3px",
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ color: c }}>{v}</div>
                </div>
              ))}
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--muted)",
                    letterSpacing: "1px",
                    marginBottom: "3px",
                  }}
                >
                  STATUS
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: statusColor(b.status),
                      border: `1px solid ${statusColor(b.status)}`,
                      padding: "2px 8px",
                      borderRadius: "2px",
                      letterSpacing: "1px",
                      width: "fit-content",
                    }}
                  >
                    {b.status.toUpperCase()}
                  </span>
                  {b.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--danger)",
                        color: "var(--danger)",
                        padding: "3px 8px",
                        cursor: "pointer",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        fontFamily: "var(--font-mono)",
                        borderRadius: "2px",
                        width: "fit-content",
                      }}
                    >
                      CANCEL
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
