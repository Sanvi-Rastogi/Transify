export default function StatCard({
  label,
  value,
  sub,
  accent = "var(--accent)",
  pulse = false,
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderTop: `2px solid ${accent}`,
        padding: "20px 24px",
        borderRadius: "2px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {pulse && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
            animation: "pulseAnim 1.5s infinite",
          }}
        />
      )}
      <div
        style={{
          fontSize: "11px",
          color: "var(--muted)",
          letterSpacing: "2px",
          marginBottom: "10px",
        }}
      >
        {label.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "36px",
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}
        >
          {sub}
        </div>
      )}
      <style>{`@keyframes pulseAnim { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
