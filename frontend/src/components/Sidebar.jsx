import { NavLink } from "react-router-dom";

const schedulerLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/routes", label: "Routes" },
  { to: "/schedules", label: "Schedules" },
  { to: "/predictions", label: "Predictions" },
];

const userLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/bookings", label: "My Travel" },
  { to: "/predictions", label: "Predictions" },
];

export default function Sidebar({ connected, user, onLogout }) {
  const links = user?.role === "scheduler" ? schedulerLinks : userLinks;

  return (
    <aside
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "20px",
            letterSpacing: "-0.5px",
            color: "var(--accent)",
          }}
        >
          TRANSI<span style={{ color: "var(--text)" }}>FY</span>
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "var(--muted)",
            marginTop: "4px",
            letterSpacing: "2px",
          }}
        >
          TRANSPORT PLATFORM
        </div>
      </div>

      <div
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: connected ? "var(--accent3)" : "var(--danger)",
            boxShadow: connected ? "0 0 8px var(--accent3)" : "none",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            color: "var(--muted)",
            letterSpacing: "1px",
          }}
        >
          {connected ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      {/* User info */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "var(--text)", fontWeight: 500 }}
        >
          {user?.name}
        </div>
        <div
          style={{
            fontSize: "10px",
            marginTop: "3px",
            letterSpacing: "1.5px",
            color:
              user?.role === "scheduler" ? "var(--accent2)" : "var(--accent)",
          }}
        >
          {user?.role === "scheduler" ? "🗂 SCHEDULER" : "🧳 TRAVELLER"}
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 0" }}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              textDecoration: "none",
              fontSize: "13px",
              letterSpacing: "1.5px",
              fontFamily: "var(--font-mono)",
              color: isActive ? "var(--accent)" : "var(--muted)",
              background: isActive ? "rgba(0,229,255,0.05)" : "transparent",
              borderLeft: isActive
                ? "2px solid var(--accent)"
                : "2px solid transparent",
              transition: "all 0.15s ease",
            })}
          >
            {label.toUpperCase()}
          </NavLink>
        ))}
      </nav>

      <div
        style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            cursor: "pointer",
            padding: "8px",
            fontSize: "10px",
            letterSpacing: "1.5px",
            fontFamily: "var(--font-mono)",
            borderRadius: "2px",
          }}
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
