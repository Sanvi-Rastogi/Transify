import { useState } from "react";
import { login, register } from "../api/client";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    background: "#0d1117",
    border: "1px solid #1e2a35",
    color: "#e8f0f7",
    padding: "12px 16px",
    borderRadius: "2px",
    fontSize: "13px",
    fontFamily: "'DM Mono', monospace",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? login : register;
      const res = await fn(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      onLogin(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Mono', monospace",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(0,229,255,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.04) 0%, transparent 60%)",
      }}
    >
      <div style={{ width: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "32px",
              letterSpacing: "-1px",
            }}
          >
            <span style={{ color: "#00e5ff" }}>TRANSI</span>
            <span style={{ color: "#e8f0f7" }}>FY</span>
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#4a6070",
              letterSpacing: "3px",
              marginTop: "6px",
            }}
          >
            PUBLIC TRANSPORT PLATFORM
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#0d1117",
            border: "1px solid #1e2a35",
            borderRadius: "2px",
            padding: "36px",
          }}
        >
          {/* Toggle */}
          <div
            style={{
              display: "flex",
              marginBottom: "28px",
              border: "1px solid #1e2a35",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background:
                    mode === m ? "rgba(0,229,255,0.08)" : "transparent",
                  color: mode === m ? "#00e5ff" : "#4a6070",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  fontFamily: "'DM Mono', monospace",
                  borderBottom:
                    mode === m ? "2px solid #00e5ff" : "2px solid transparent",
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {mode === "register" && (
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#4a6070",
                    letterSpacing: "1.5px",
                    marginBottom: "6px",
                  }}
                >
                  FULL NAME
                </div>
                <input
                  style={inputStyle}
                  placeholder="Arjun Mehta"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#00e5ff")}
                  onBlur={(e) => (e.target.style.borderColor = "#1e2a35")}
                />
              </div>
            )}

            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#4a6070",
                  letterSpacing: "1.5px",
                  marginBottom: "6px",
                }}
              >
                EMAIL
              </div>
              <input
                style={inputStyle}
                placeholder="user@transit.in"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                onFocus={(e) => (e.target.style.borderColor = "#00e5ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e2a35")}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#4a6070",
                  letterSpacing: "1.5px",
                  marginBottom: "6px",
                }}
              >
                PASSWORD
              </div>
              <input
                style={inputStyle}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                onFocus={(e) => (e.target.style.borderColor = "#00e5ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e2a35")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {mode === "register" && (
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#4a6070",
                    letterSpacing: "1.5px",
                    marginBottom: "6px",
                  }}
                >
                  ROLE
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["user", "scheduler"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setForm((p) => ({ ...p, role: r }))}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background:
                          form.role === r
                            ? "rgba(0,229,255,0.08)"
                            : "transparent",
                        border: `1px solid ${form.role === r ? "#00e5ff" : "#1e2a35"}`,
                        color: form.role === r ? "#00e5ff" : "#4a6070",
                        cursor: "pointer",
                        fontSize: "11px",
                        letterSpacing: "1.5px",
                        fontFamily: "'DM Mono', monospace",
                        borderRadius: "2px",
                      }}
                    >
                      {r === "user" ? "🧳 TRAVELLER" : "🗂 SCHEDULER"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div
                style={{
                  background: "rgba(255,59,92,0.08)",
                  border: "1px solid #ff3b5c",
                  borderRadius: "2px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: "#ff3b5c",
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "13px",
                background: "transparent",
                border: "1px solid #00e5ff",
                color: "#00e5ff",
                cursor: "pointer",
                fontSize: "12px",
                letterSpacing: "2px",
                fontFamily: "'DM Mono', monospace",
                borderRadius: "2px",
                transition: "background 0.2s",
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(0,229,255,0.08)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              {loading
                ? "PLEASE WAIT..."
                : mode === "login"
                  ? "LOGIN →"
                  : "CREATE ACCOUNT →"}
            </button>
          </div>

          {/* Demo creds */}
          <div
            style={{
              marginTop: "24px",
              padding: "14px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #1e2a35",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#4a6070",
                letterSpacing: "1.5px",
                marginBottom: "10px",
              }}
            >
              DEMO CREDENTIALS
            </div>
            {[
              ["Traveller", "user@transit.in", "user1234"],
              ["Scheduler", "scheduler@transit.in", "sched1234"],
            ].map(([role, email, pass]) => (
              <div
                key={role}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#4a6070" }}>
                  {role}
                </span>
                <button
                  onClick={() =>
                    setForm((p) => ({ ...p, email, password: pass }))
                  }
                  style={{
                    background: "transparent",
                    border: "1px solid #1e2a35",
                    color: "#00e5ff",
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    fontFamily: "'DM Mono', monospace",
                    borderRadius: "2px",
                  }}
                >
                  USE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
