export default function DelayBadge({ status, delay }) {
  const color =
    status === "on-time"
      ? "var(--accent3)"
      : status === "delayed"
        ? "var(--warn)"
        : "var(--danger)";
  return (
    <span
      style={{
        fontSize: "10px",
        letterSpacing: "1.5px",
        padding: "3px 8px",
        border: `1px solid ${color}`,
        color,
        borderRadius: "2px",
        fontFamily: "var(--font-mono)",
      }}
    >
      {status?.toUpperCase()}
      {delay > 0 ? ` +${delay}m` : ""}
    </span>
  );
}
