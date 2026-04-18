import DelayBadge from "./DelayBadge";

export default function VehicleCard({ vehicle, liveData }) {
  const loc = liveData || vehicle.location;
  const occupancyPct =
    vehicle.capacity > 0
      ? Math.round((vehicle.currentOccupancy / vehicle.capacity) * 100)
      : 0;
  const barColor =
    occupancyPct > 85
      ? "var(--danger)"
      : occupancyPct > 60
        ? "var(--warn)"
        : "var(--accent3)";

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "2px",
        padding: "18px",
        position: "relative",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--accent)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              color: "var(--accent)",
            }}
          >
            {vehicle.vehicleId}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--muted)",
              marginTop: "2px",
              letterSpacing: "1px",
            }}
          >
            {vehicle.type?.toUpperCase()} • {vehicle.routeNumber}
          </div>
        </div>
        <DelayBadge
          status={vehicle.status === "on-route" ? "on-time" : vehicle.status}
          delay={vehicle.delayMinutes}
        />
      </div>

      {/* Occupancy bar */}
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "var(--muted)",
            marginBottom: "5px",
            letterSpacing: "1px",
          }}
        >
          <span>OCCUPANCY</span>
          <span style={{ color: barColor }}>{occupancyPct}%</span>
        </div>
        <div
          style={{
            height: "3px",
            background: "var(--border)",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${occupancyPct}%`,
              background: barColor,
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
      >
        {[
          ["DRIVER", vehicle.driver || "N/A"],
          ["SPEED", `${liveData?.speed ?? 0} km/h`],
          ["NEXT STOP", vehicle.nextStop || "—"],
          ["AT STOP", vehicle.currentStop || "—"],
        ].map(([k, v]) => (
          <div key={k} style={{ fontSize: "10px" }}>
            <div style={{ color: "var(--muted)", letterSpacing: "1px" }}>
              {k}
            </div>
            <div
              style={{
                color: "var(--text)",
                marginTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
